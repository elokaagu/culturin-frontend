"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, Download, Maximize2, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { startDeckSession, trackPageView } from "@/lib/deckAnalytics";
import { getCmsBrowserClient } from "@/lib/cms/browser";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Serve the worker from our own origin (avoids unpkg CDN / CSP failures that leave the viewer stuck on “Rendering…”).
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface PublicDeck {
  id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  page_count: number | null;
  page_image_urls: string[] | null;
  require_email: boolean;
  allow_download: boolean;
  has_password: boolean;
  partner_link_id: string | null;
  partner_label: string | null;
}

interface Props {
  token: string;
}

export default function InteractiveDeckViewer({ token }: Props) {
  const [deck, setDeck] = useState<PublicDeck | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [pdfError, setPdfError] = useState("");
  const [loading, setLoading] = useState(true);
  const [emailPassed, setEmailPassed] = useState(false);
  const [passwordPassed, setPasswordPassed] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [unlocking, setUnlocking] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageWidth, setPageWidth] = useState(800);
  const [pdfReady, setPdfReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [pageImageUrls, setPageImageUrls] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [devicePixelRatio, setDevicePixelRatio] = useState(1.5);

  const useImages = pageImageUrls.length > 0;

  const sessionStartedAt = useRef<number>(Date.now());
  const pageEnteredAt = useRef<number>(Date.now());
  const maxPageReached = useRef(1);
  const pagesSeen = useRef(new Set<number>([1]));
  const currentPageRef = useRef(1);
  const viewerRef = useRef<HTMLDivElement>(null);

  const pdfFile = useMemo(() => (fileUrl ? { url: fileUrl } : null), [fileUrl]);

  useEffect(() => {
    const updateWidth = () => {
      const fullscreen = Boolean(document.fullscreenElement);
      const chrome = 56 + 72; // header + footer
      const padX = fullscreen ? 32 : 48;
      const padY = fullscreen ? 24 : 48;
      const maxW = window.innerWidth - padX;
      const maxH = window.innerHeight - chrome - padY;
      // Fit landscape slides; fall back to width-capped layout when not fullscreen.
      const fromHeight = maxH * (16 / 9);
      const capped = fullscreen ? Math.min(maxW, fromHeight) : Math.min(maxW, 920);
      setPageWidth(Math.max(280, Math.floor(capped)));
      setDevicePixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [isFullscreen]);

  // Prefetch neighboring page images for snappy next/prev.
  useEffect(() => {
    if (!useImages) return;
    [pageNumber - 1, pageNumber + 1, pageNumber + 2].forEach((n) => {
      const url = pageImageUrls[n - 1];
      if (!url) return;
      const img = new window.Image();
      img.decoding = "async";
      img.src = url;
    });
  }, [useImages, pageImageUrls, pageNumber]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const el = viewerRef.current;
    if (!el) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await el.requestFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen failed", err);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const db = getCmsBrowserClient();
      if (!db) {
        setError("This deck link is unavailable.");
        setLoading(false);
        return;
      }
      const { data, error: rpcError } = await db.rpc("get_deck_by_token", {
        p_token: token,
      });

      if (rpcError) {
        console.error(rpcError);
        setError("This deck link is unavailable.");
        setLoading(false);
        return;
      }

      const row = (Array.isArray(data) ? data[0] : data) as PublicDeck | undefined;
      if (!row) {
        setError("This deck is unavailable or has been archived.");
        setLoading(false);
        return;
      }

      setDeck(row);
      setFileUrl(row.file_url);
      const images = Array.isArray(row.page_image_urls) ? row.page_image_urls.filter(Boolean) : [];
      setPageImageUrls(images);
      if (images.length > 0) {
        setNumPages(images.length);
        setPdfReady(true);
      } else if (row.page_count) {
        setNumPages(row.page_count);
      }
      if (!row.require_email) setEmailPassed(true);
      if (!row.has_password) setPasswordPassed(true);
      setLoading(false);
    };

    load();
  }, [token]);

  const gatesCleared = emailPassed && passwordPassed;

  const beginSession = useCallback(
    async (viewerEmail?: string, viewerName?: string) => {
      if (!deck) return;
      const db = getCmsBrowserClient();
      if (!db) return;
      try {
        const id = await startDeckSession(db, {
          deckId: deck.id,
          viewerEmail,
          viewerName,
          partnerLinkId: deck.partner_link_id,
        });
        setSessionId(id);
        sessionStartedAt.current = Date.now();
        pageEnteredAt.current = Date.now();
      } catch (err) {
        console.error(err);
      }
    },
    [deck],
  );

  useEffect(() => {
    if (deck && gatesCleared && (fileUrl || useImages) && !sessionId) {
      beginSession(email.trim() || undefined, name.trim() || undefined);
    }
  }, [deck, gatesCleared, fileUrl, useImages, sessionId, beginSession, email, name]);

  const flushPage = useCallback(
    async (leavingPage: number, opts?: { resetTimer?: boolean }) => {
      if (!sessionId || !deck) return;
      const spent = Date.now() - pageEnteredAt.current;
      const durationSeconds = Math.round((Date.now() - sessionStartedAt.current) / 1000);
      const completed = numPages > 0 && maxPageReached.current >= numPages;

      const db = getCmsBrowserClient();
      if (!db) return;
      try {
        await trackPageView(db, {
          sessionId,
          deckId: deck.id,
          pageNumber: leavingPage,
          timeSpentMs: spent,
          maxPageReached: maxPageReached.current,
          pagesViewed: pagesSeen.current.size,
          completed,
          durationSeconds,
        });
        if (opts?.resetTimer) {
          pageEnteredAt.current = Date.now();
        }
      } catch (err) {
        console.error("Deck analytics track failed", err);
      }
    },
    [sessionId, deck, numPages],
  );

  const goToPage = async (next: number) => {
    if (next < 1 || (numPages > 0 && next > numPages) || next === pageNumber) return;
    await flushPage(pageNumber);
    pagesSeen.current.add(next);
    maxPageReached.current = Math.max(maxPageReached.current, next);
    currentPageRef.current = next;
    pageEnteredAt.current = Date.now();
    setPageNumber(next);
  };

  // Persist engagement while viewing (page 1 used to only flush on leave/nav).
  useEffect(() => {
    if (!sessionId) return;
    const tick = () => {
      void flushPage(currentPageRef.current, { resetTimer: true });
    };
    const interval = window.setInterval(tick, 15000);
    const onHide = () => {
      if (document.visibilityState === "hidden") tick();
    };
    const onPageHide = () => tick();
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onPageHide);
      void flushPage(currentPageRef.current);
    };
  }, [sessionId, flushPage]);

  const onDocumentLoad = async ({ numPages: pages }: { numPages: number }) => {
    setPdfError("");
    setNumPages(pages);
    setPdfReady(true);
    if (deck && (!deck.page_count || deck.page_count !== pages)) {
      const db = getCmsBrowserClient();
      if (db) {
        await db.rpc("report_deck_page_count", {
          p_deck_id: deck.id,
          p_page_count: pages,
        });
      }
    }
  };

  const handleEmailGate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setEmailPassed(true);
  };

  const handlePasswordGate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setUnlocking(true);
    setPasswordError("");

    const db = getCmsBrowserClient();
    if (!db) {
      setPasswordError("Could not verify password.");
      setUnlocking(false);
      return;
    }
    const { data, error: unlockError } = await db.rpc("unlock_deck", {
      p_token: token,
      p_password: password,
    });

    setUnlocking(false);

    if (unlockError) {
      setPasswordError("Could not verify password.");
      return;
    }

    const row = Array.isArray(data) ? data[0] : data;
    if (!row?.file_url) {
      setPasswordError("Incorrect password.");
      return;
    }

    setFileUrl(row.file_url);
    const images = Array.isArray(row.page_image_urls) ? row.page_image_urls.filter(Boolean) : [];
    setPageImageUrls(images);
    if (images.length > 0) {
      setNumPages(images.length);
      setPdfReady(true);
    }
    setPasswordPassed(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
        <p className="animate-pulse text-xs font-semibold uppercase tracking-[0.2em] text-culturin-300">
          Loading deck…
        </p>
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-6 text-center text-white">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-culturin-300">Culturin</p>
        <p className="mb-2 font-display text-2xl font-semibold">Deck unavailable</p>
        <p className="text-sm text-white/60">{error || "This link is no longer active."}</p>
      </div>
    );
  }

  if (!emailPassed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-6 text-white">
        <div className="w-full max-w-sm text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-culturin-300">Culturin</p>
          <p className="mb-2 font-display text-3xl font-semibold tracking-tight">{deck.title}</p>
          <p className="mb-10 text-xs uppercase tracking-[0.2em] text-white/55">Enter your details to view</p>
          <form onSubmit={handleEmailGate} className="space-y-4 text-left">
            <div>
              <label className="mb-2 block text-[0.7rem] font-medium uppercase tracking-[0.12em] text-white/58">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/12 bg-black/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus-visible:border-culturin-400/55 focus-visible:ring-2 focus-visible:ring-culturin-400/20"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="mb-2 block text-[0.7rem] font-medium uppercase tracking-[0.12em] text-white/58">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/12 bg-black/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus-visible:border-culturin-400/55 focus-visible:ring-2 focus-visible:ring-culturin-400/20"
                placeholder="you@company.com"
              />
            </div>
            <button
              type="submit"
              className="mt-2 w-full rounded-full border border-culturin-400/40 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-culturin-100"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!passwordPassed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-6 text-white">
        <div className="w-full max-w-sm text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-culturin-300">Culturin</p>
          <p className="mb-2 font-display text-3xl font-semibold tracking-tight">{deck.title}</p>
          <p className="mb-10 text-xs uppercase tracking-[0.2em] text-white/55">Password required</p>
          <form onSubmit={handlePasswordGate} className="space-y-4 text-left">
            <div>
              <label className="mb-2 block text-[0.7rem] font-medium uppercase tracking-[0.12em] text-white/58">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/12 bg-black/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus-visible:border-culturin-400/55 focus-visible:ring-2 focus-visible:ring-culturin-400/20"
                placeholder="Enter password"
                autoFocus
              />
            </div>
            {passwordError && (
              <p className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                {passwordError}
              </p>
            )}
            <button
              type="submit"
              disabled={unlocking}
              className="mt-2 w-full rounded-full border border-culturin-400/40 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-culturin-100 disabled:opacity-40"
            >
              {unlocking ? "Checking…" : "View deck"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!useImages && (!fileUrl || !pdfFile)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
        <p className="text-sm text-white/60">Could not load this deck.</p>
      </div>
    );
  }

  const currentImageUrl = useImages ? pageImageUrls[pageNumber - 1] : null;

  return (
    <div
      ref={viewerRef}
      className="flex min-h-screen flex-col bg-[#0a0a0a] text-white"
      onContextMenu={deck.allow_download ? undefined : (e) => e.preventDefault()}
    >
      <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-white/10 px-4 md:px-8">
        <div className="min-w-0">
          <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-culturin-300">
            Culturin
            {deck.partner_label ? ` · ${deck.partner_label}` : ""}
          </p>
          <h1 className="truncate font-display text-sm font-semibold md:text-base">{deck.title}</h1>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {deck.allow_download && fileUrl ? (
            <a
              href={fileUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-white/60 transition-colors hover:text-culturin-300"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>
          ) : null}
          <button
            type="button"
            onClick={() => void toggleFullscreen()}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs uppercase tracking-[0.15em] text-white/70 transition-colors hover:border-culturin-400/50 hover:text-culturin-300"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            title={isFullscreen ? "Exit fullscreen (Esc)" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" aria-hidden /> : <Maximize2 className="h-3.5 w-3.5" aria-hidden />}
            <span className="hidden sm:inline">{isFullscreen ? "Exit" : "Fullscreen"}</span>
          </button>
          <p className="tabular-nums text-xs text-white/60">
            {pdfReady || useImages ? `${pageNumber} / ${numPages}` : "…"}
          </p>
        </div>
      </header>

      <div
        className={`flex min-h-0 flex-1 items-center justify-center overflow-auto bg-white/[0.03] ${
          isFullscreen ? "px-2 py-3" : "px-3 py-6"
        }`}
      >
        <div className="border border-white/10 bg-white shadow-xl shadow-black/40">
          {useImages && currentImageUrl ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={pageNumber}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.18 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentImageUrl}
                  alt={`${deck.title} — page ${pageNumber}`}
                  width={pageWidth}
                  className="block h-auto max-w-full"
                  style={{ width: pageWidth }}
                  decoding="async"
                  fetchPriority="high"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            <Document
              file={pdfFile}
              loading={
                <div className="flex aspect-[4/3] w-[min(92vw,920px)] flex-col items-center justify-center gap-3 px-6 text-center">
                  <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
                    {loadProgress > 0 ? `Loading ${Math.round(loadProgress * 100)}%` : "Loading PDF…"}
                  </p>
                  <div className="h-1.5 w-40 overflow-hidden rounded-full bg-neutral-200">
                    <div
                      className="h-full rounded-full bg-culturin-400 transition-[width] duration-200"
                      style={{ width: `${Math.round(Math.max(loadProgress, 0.08) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-neutral-400">Ask the owner to enable fast preview for instant opens.</p>
                </div>
              }
              error={
                <div className="w-[min(92vw,920px)] px-8 py-16 text-center text-sm text-neutral-600">
                  {pdfError || "Could not load this PDF."}
                </div>
              }
              onLoadProgress={({ loaded, total }) => {
                if (total > 0) setLoadProgress(Math.min(1, loaded / total));
              }}
              onLoadSuccess={onDocumentLoad}
              onLoadError={(err) => {
                console.error("PDF load error", err);
                setPdfError(err?.message || "Could not load this PDF.");
                setPdfReady(false);
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={pageNumber}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <Page
                    pageNumber={pageNumber}
                    width={pageWidth}
                    devicePixelRatio={devicePixelRatio}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    loading={
                      <div
                        className="flex items-center justify-center text-sm uppercase tracking-[0.2em] text-neutral-500"
                        style={{ width: pageWidth, minHeight: pageWidth * 0.7 }}
                      >
                        Rendering…
                      </div>
                    }
                  />
                </motion.div>
              </AnimatePresence>
            </Document>
          )}
        </div>
      </div>

      <footer className="flex shrink-0 items-center justify-center gap-4 border-t border-white/10 px-4 py-4">
        <button
          type="button"
          onClick={() => goToPage(pageNumber - 1)}
          disabled={pageNumber <= 1}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-xs uppercase tracking-[0.15em] transition-colors hover:border-culturin-400/50 hover:text-culturin-300 disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </button>
        <div className="hidden max-w-md items-center gap-1.5 overflow-x-auto px-2 sm:flex">
          {Array.from({ length: numPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => goToPage(n)}
              className={`h-2 w-2 rounded-full transition-colors ${
                n === pageNumber ? "bg-culturin-400" : "bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to page ${n}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => goToPage(pageNumber + 1)}
          disabled={!numPages || pageNumber >= numPages}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-xs uppercase tracking-[0.15em] transition-colors hover:border-culturin-400/50 hover:text-culturin-300 disabled:opacity-30"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </footer>
    </div>
  );
}
