"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, Download, Maximize2, Minimize2, X } from "lucide-react";
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

type SlideSize = { width: number; maxHeight: number };

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
  const [slideSize, setSlideSize] = useState<SlideSize>({ width: 800, maxHeight: 600 });
  const [pdfReady, setPdfReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [pageImageUrls, setPageImageUrls] = useState<string[]>([]);
  const [isFullscreenApi, setIsFullscreenApi] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [immersiveForced, setImmersiveForced] = useState(false);
  // After Exit in landscape, stay in chrome until upright (or Full again).
  const [landscapeOptOut, setLandscapeOptOut] = useState(false);
  const [devicePixelRatio, setDevicePixelRatio] = useState(1.5);

  const useImages = pageImageUrls.length > 0;
  const isImmersive =
    isFullscreenApi || immersiveForced || (isLandscape && !landscapeOptOut);

  const sessionStartedAt = useRef<number>(Date.now());
  const pageEnteredAt = useRef<number>(Date.now());
  const maxPageReached = useRef(1);
  const pagesSeen = useRef(new Set<number>([1]));
  const currentPageRef = useRef(1);
  const viewerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const pdfFile = useMemo(() => (fileUrl ? { url: fileUrl } : null), [fileUrl]);

  const updateLayout = useCallback(() => {
    const landscape =
      typeof window !== "undefined" &&
      (window.matchMedia("(orientation: landscape)").matches || window.innerWidth > window.innerHeight);

    setIsLandscape(landscape);

    const immersive =
      Boolean(document.fullscreenElement) ||
      immersiveForced ||
      (landscape && !landscapeOptOut);
    const headerH = immersive ? 40 : 52;
    const footerH = immersive ? 52 : 88;
    const tipH = immersive ? 0 : 28; // mobile tip row (approx)
    const sideGutter = 8; // keep arrows from eating slide width too hard
    const pad = immersive ? 6 : 10;
    const availW = Math.max(240, window.innerWidth - pad * 2 - (immersive ? 0 : sideGutter));
    const availH = Math.max(
      160,
      window.innerHeight - headerH - footerH - (window.innerWidth < 640 && !immersive ? tipH : 0) - pad * 2,
    );
    // Fit a landscape slide inside the available box (use full phone width in portrait).
    const widthFromHeight = availH * (16 / 9);
    const width = Math.floor(Math.min(availW, widthFromHeight));
    setSlideSize({ width, maxHeight: availH });
    setDevicePixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  }, [immersiveForced, landscapeOptOut]);

  useEffect(() => {
    updateLayout();
    window.addEventListener("resize", updateLayout);
    window.addEventListener("orientationchange", updateLayout);
    return () => {
      window.removeEventListener("resize", updateLayout);
      window.removeEventListener("orientationchange", updateLayout);
    };
  }, [updateLayout]);

  // Returning to portrait clears opt-out so the next rotate goes immersive again.
  useEffect(() => {
    if (!isLandscape) setLandscapeOptOut(false);
  }, [isLandscape]);

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
      setIsFullscreenApi(Boolean(document.fullscreenElement));
      updateLayout();
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, [updateLayout]);

  // Lock body scroll while viewing; helps mobile chrome feel app-like.
  useEffect(() => {
    if (!gatesReady(emailPassed, passwordPassed, loading, error)) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [emailPassed, passwordPassed, loading, error]);

  const enterImmersive = useCallback(async () => {
    setLandscapeOptOut(false);
    setImmersiveForced(true);
    const el = viewerRef.current;
    if (el && el.requestFullscreen && !document.fullscreenElement) {
      try {
        await el.requestFullscreen();
      } catch {
        // iOS Safari often blocks Fullscreen API — CSS immersive still applies.
      }
    }
  }, []);

  const exitImmersive = useCallback(async () => {
    setImmersiveForced(false);
    if (isLandscape) setLandscapeOptOut(true);
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {
        // ignore
      }
    }
  }, [isLandscape]);

  const closeViewer = useCallback(() => {
    void exitImmersive();
    if (typeof window !== "undefined") {
      if (window.history.length > 1) window.history.back();
      else window.location.href = "/";
    }
  }, [exitImmersive]);

  const toggleFullscreen = useCallback(async () => {
    if (isImmersive) {
      await exitImmersive();
      return;
    }
    await enterImmersive();
  }, [enterImmersive, exitImmersive, isImmersive]);

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

  const goToPage = useCallback(
    async (next: number) => {
      if (next < 1 || (numPages > 0 && next > numPages) || next === pageNumber) return;
      await flushPage(pageNumber);
      pagesSeen.current.add(next);
      maxPageReached.current = Math.max(maxPageReached.current, next);
      currentPageRef.current = next;
      pageEnteredAt.current = Date.now();
      setPageNumber(next);
    },
    [flushPage, numPages, pageNumber],
  );

  // Keyboard + swipe navigation
  useEffect(() => {
    if (!gatesCleared) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        void goToPage(pageNumber + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        void goToPage(pageNumber - 1);
      } else if (e.key === "Escape") {
        void exitImmersive();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gatesCleared, goToPage, pageNumber, exitImmersive]);

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

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.changedTouches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null || touchStartY.current == null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX.current;
    const dy = t.clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) void goToPage(pageNumber + 1);
    else void goToPage(pageNumber - 1);
  };

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0a0a0a] text-white">
        <p className="animate-pulse text-xs font-semibold uppercase tracking-[0.2em] text-culturin-300">
          Loading deck…
        </p>
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-[#0a0a0a] px-6 text-center text-white">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-culturin-300">Culturin</p>
        <p className="mb-2 font-display text-2xl font-semibold">Deck unavailable</p>
        <p className="text-sm text-white/60">{error || "This link is no longer active."}</p>
      </div>
    );
  }

  if (!emailPassed) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-[#0a0a0a] px-6 text-white">
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
      <div className="flex min-h-dvh flex-col items-center justify-center bg-[#0a0a0a] px-6 text-white">
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
      <div className="flex min-h-dvh items-center justify-center bg-[#0a0a0a] text-white">
        <p className="text-sm text-white/60">Could not load this deck.</p>
      </div>
    );
  }

  const currentImageUrl = useImages ? pageImageUrls[pageNumber - 1] : null;
  const canPrev = pageNumber > 1;
  const canNext = numPages > 0 && pageNumber < numPages;
  // Always offer a clear exit while immersive (API fullscreen, forced, or landscape).
  const showExit = isImmersive;

  return (
    <div
      ref={viewerRef}
      className="relative flex h-dvh max-h-dvh flex-col overflow-hidden bg-[#0a0a0a] text-white"
      onContextMenu={deck.allow_download ? undefined : (e) => e.preventDefault()}
    >
      <header
        className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-3 pt-[max(0.5rem,env(safe-area-inset-top))] sm:px-5"
        style={{ minHeight: isImmersive ? 44 : 52 }}
      >
        <div className="min-w-0 flex-1">
          {!isImmersive || !isLandscape ? (
            <>
              <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-culturin-300">
                Culturin
                {deck.partner_label ? ` · ${deck.partner_label}` : ""}
              </p>
              <h1 className="truncate font-display text-sm font-semibold leading-tight sm:text-base">
                {deck.title}
              </h1>
            </>
          ) : (
            <p className="truncate text-xs text-white/70">
              {deck.title}
              <span className="ml-2 tabular-nums text-white/45">
                {pdfReady || useImages ? `${pageNumber}/${numPages}` : ""}
              </span>
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {deck.allow_download && fileUrl && !isImmersive ? (
            <a
              href={fileUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-culturin-400/50 hover:text-culturin-300"
              aria-label="Download PDF"
            >
              <Download className="h-4 w-4" />
            </a>
          ) : null}
          {showExit ? (
            <button
              type="button"
              onClick={() => void exitImmersive()}
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/15"
              aria-label="Exit fullscreen"
            >
              <Minimize2 className="h-4 w-4" aria-hidden />
              Exit
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void toggleFullscreen()}
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-white/15 px-3 text-xs uppercase tracking-[0.12em] text-white/80 transition-colors hover:border-culturin-400/50 hover:text-culturin-300"
              aria-label="Enter fullscreen"
              title="Fullscreen — or turn phone sideways"
            >
              <Maximize2 className="h-4 w-4" aria-hidden />
              Full
            </button>
          )}
          <button
            type="button"
            onClick={closeViewer}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/75 transition-colors hover:border-white/35 hover:text-white"
            aria-label="Close deck"
            title="Close deck"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      {!isImmersive ? (
        <p className="shrink-0 px-3 py-1.5 text-center text-[11px] text-white/45 sm:hidden">
          Swipe or use arrows · turn sideways for fullscreen
        </p>
      ) : null}

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-3"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Large side hit targets for mobile nav */}
        <button
          type="button"
          onClick={() => void goToPage(pageNumber - 1)}
          disabled={!canPrev}
          className="absolute left-0 top-0 z-10 flex h-full w-14 items-center justify-center text-white/80 transition enabled:active:bg-white/5 disabled:opacity-0 sm:w-16"
          aria-label="Previous slide"
        >
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/45 ring-1 ring-white/20 backdrop-blur-sm">
            <ChevronLeft className="h-6 w-6" />
          </span>
        </button>
        <button
          type="button"
          onClick={() => void goToPage(pageNumber + 1)}
          disabled={!canNext}
          className="absolute right-0 top-0 z-10 flex h-full w-14 items-center justify-center text-white/80 transition enabled:active:bg-white/5 disabled:opacity-0 sm:w-16"
          aria-label="Next slide"
        >
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/45 ring-1 ring-white/20 backdrop-blur-sm">
            <ChevronRight className="h-6 w-6" />
          </span>
        </button>

        <div className="max-h-full max-w-full overflow-hidden bg-black shadow-xl shadow-black/50">
          {useImages && currentImageUrl ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={pageNumber}
                initial={{ opacity: 0.35, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.16 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentImageUrl}
                  alt={`${deck.title} — page ${pageNumber}`}
                  width={slideSize.width}
                  className="block h-auto max-w-full select-none"
                  style={{ width: slideSize.width, maxHeight: slideSize.maxHeight, objectFit: "contain" }}
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
                <div
                  className="flex flex-col items-center justify-center gap-3 px-6 text-center"
                  style={{ width: slideSize.width, height: slideSize.width * 0.56 }}
                >
                  <p className="text-sm uppercase tracking-[0.2em] text-neutral-400">
                    {loadProgress > 0 ? `Loading ${Math.round(loadProgress * 100)}%` : "Loading PDF…"}
                  </p>
                  <div className="h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-culturin-400 transition-[width] duration-200"
                      style={{ width: `${Math.round(Math.max(loadProgress, 0.08) * 100)}%` }}
                    />
                  </div>
                </div>
              }
              error={
                <div className="px-8 py-16 text-center text-sm text-neutral-400">
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
                  initial={{ opacity: 0.35, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.16 }}
                >
                  <Page
                    pageNumber={pageNumber}
                    width={slideSize.width}
                    devicePixelRatio={devicePixelRatio}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    loading={
                      <div
                        className="flex items-center justify-center text-sm uppercase tracking-[0.2em] text-neutral-400"
                        style={{ width: slideSize.width, minHeight: slideSize.width * 0.56 }}
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

      <footer
        className="flex shrink-0 flex-col items-center gap-2 border-t border-white/10 px-3 pt-2 sm:pt-3"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="flex w-full max-w-lg items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => void goToPage(pageNumber - 1)}
            disabled={!canPrev}
            className="inline-flex h-11 min-w-[5.5rem] flex-1 items-center justify-center gap-1 rounded-full border border-white/20 bg-white/5 text-xs font-semibold uppercase tracking-[0.14em] transition enabled:active:bg-white/10 disabled:opacity-30 sm:flex-none sm:px-5"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>
          <p className="tabular-nums text-sm font-medium text-white/70">
            {pdfReady || useImages ? `${pageNumber} / ${numPages}` : "…"}
          </p>
          <button
            type="button"
            onClick={() => void goToPage(pageNumber + 1)}
            disabled={!canNext}
            className="inline-flex h-11 min-w-[5.5rem] flex-1 items-center justify-center gap-1 rounded-full border border-white/20 bg-white/5 text-xs font-semibold uppercase tracking-[0.14em] transition enabled:active:bg-white/10 disabled:opacity-30 sm:flex-none sm:px-5"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        {numPages > 0 ? (
          <div className="flex max-w-full items-center gap-1.5 overflow-x-auto px-1 pb-0.5">
            {Array.from({ length: numPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => void goToPage(n)}
                className={`h-2.5 w-2.5 shrink-0 rounded-full transition-colors ${
                  n === pageNumber ? "bg-culturin-400" : "bg-white/25"
                }`}
                aria-label={`Go to page ${n}`}
              />
            ))}
          </div>
        ) : null}
        {isImmersive && isLandscape ? (
          <p className="text-center text-[11px] uppercase tracking-[0.14em] text-white/40">
            Exit · rotate upright · or Close to leave
          </p>
        ) : null}
      </footer>
    </div>
  );
}

function gatesReady(
  emailPassed: boolean,
  passwordPassed: boolean,
  loading: boolean,
  error: string,
): boolean {
  return !loading && !error && emailPassed && passwordPassed;
}
