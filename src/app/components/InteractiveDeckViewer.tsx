"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { startDeckSession, trackPageView } from "@/lib/deckAnalytics";
import { getCmsBrowserClient } from "@/lib/cms/browser";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PublicDeck {
  id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  page_count: number | null;
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

  const sessionStartedAt = useRef<number>(Date.now());
  const pageEnteredAt = useRef<number>(Date.now());
  const maxPageReached = useRef(1);
  const pagesSeen = useRef(new Set<number>([1]));
  const currentPageRef = useRef(1);

  useEffect(() => {
    const updateWidth = () => {
      const w = Math.min(window.innerWidth - 48, 920);
      setPageWidth(Math.max(280, w));
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
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
    [deck]
  );

  useEffect(() => {
    if (deck && gatesCleared && fileUrl && !sessionId) {
      beginSession(email.trim() || undefined, name.trim() || undefined);
    }
  }, [deck, gatesCleared, fileUrl, sessionId, beginSession, email, name]);

  const flushPage = useCallback(
    async (leavingPage: number) => {
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
      } catch (err) {
        console.error(err);
      }
    },
    [sessionId, deck, numPages]
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

  useEffect(() => {
    return () => {
      void flushPage(currentPageRef.current);
    };
  }, [flushPage]);

  const onDocumentLoad = async ({ numPages: pages }: { numPages: number }) => {
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
    setPasswordPassed(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-[#121212] flex items-center justify-center">
        <p className="text-neutral-500 dark:text-white/60 text-sm tracking-[0.2em] uppercase animate-pulse">
          Loading deck…
        </p>
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-[#121212] flex flex-col items-center justify-center px-6 text-center">
        <p className="font-display text-2xl mb-2">Deck unavailable</p>
        <p className="text-sm text-neutral-500 dark:text-white/60">
          {error || "This link is no longer active."}
        </p>
      </div>
    );
  }

  if (!emailPassed) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-[#121212] flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <p className="font-display text-3xl mb-2">{deck.title}</p>
          <p className="text-xs tracking-[0.25em] uppercase text-neutral-500 dark:text-white/60 mb-10">
            Enter your details to view
          </p>
          <form onSubmit={handleEmailGate} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-500 dark:text-white/60 mb-2">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border border-neutral-200 dark:border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-culturin-400/50"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-500 dark:text-white/60 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border border-neutral-200 dark:border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-culturin-400/50"
                placeholder="you@company.com"
              />
            </div>
            <button
              type="submit"
              className="w-full mt-2 px-5 py-3 text-xs tracking-[0.2em] uppercase bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90 transition-opacity"
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
      <div className="min-h-screen bg-neutral-50 dark:bg-[#121212] flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <p className="font-display text-3xl mb-2">{deck.title}</p>
          <p className="text-xs tracking-[0.25em] uppercase text-neutral-500 dark:text-white/60 mb-10">
            Password required
          </p>
          <form onSubmit={handlePasswordGate} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-neutral-500 dark:text-white/60 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border border-neutral-200 dark:border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-culturin-400/50"
                placeholder="Enter password"
                autoFocus
              />
            </div>
            {passwordError && (
              <p className="text-sm text-red-600 dark:text-red-400">{passwordError}</p>
            )}
            <button
              type="submit"
              disabled={unlocking}
              className="w-full mt-2 px-5 py-3 text-xs tracking-[0.2em] uppercase bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {unlocking ? "Checking…" : "View deck"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!fileUrl) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-[#121212] flex items-center justify-center">
        <p className="text-sm text-neutral-500 dark:text-white/60">Could not load this deck.</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-neutral-50 dark:bg-[#121212] text-neutral-900 dark:text-white flex flex-col"
      onContextMenu={deck.allow_download ? undefined : (e) => e.preventDefault()}
    >
      <header className="flex items-center justify-between px-4 md:px-8 h-14 border-b border-neutral-200 dark:border-white/10 gap-4">
        <div className="min-w-0">
          <p className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 dark:text-white/60 mb-0.5">
            Culturin
            {deck.partner_label ? ` · ${deck.partner_label}` : ""}
          </p>
          <h1 className="text-sm md:text-base truncate font-display">{deck.title}</h1>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {deck.allow_download && (
            <a
              href={fileUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs tracking-[0.15em] uppercase text-neutral-500 dark:text-white/60 hover:text-neutral-900 dark:text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>
          )}
          <p className="text-xs text-neutral-500 dark:text-white/60 tabular-nums">
            {pdfReady ? `${pageNumber} / ${numPages}` : "…"}
          </p>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-3 py-6 overflow-auto bg-neutral-100/80 dark:bg-white/5">
        <AnimatePresence mode="wait">
          <motion.div
            key={pageNumber}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
            className="shadow-xl border border-neutral-200 dark:border-white/10 bg-white"
          >
            <Document
              file={fileUrl}
              loading={
                <div className="w-[min(92vw,920px)] aspect-[4/3] flex items-center justify-center text-neutral-500 dark:text-white/60 text-sm tracking-[0.2em] uppercase">
                  Rendering…
                </div>
              }
              error={
                <div className="px-8 py-16 text-center text-neutral-500 dark:text-white/60 text-sm">
                  Could not load this PDF.
                </div>
              }
              onLoadSuccess={onDocumentLoad}
            >
              <Page
                pageNumber={pageNumber}
                width={pageWidth}
                renderTextLayer
                renderAnnotationLayer
              />
            </Document>
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="flex items-center justify-center gap-4 px-4 py-4 border-t border-neutral-200 dark:border-white/10">
        <button
          type="button"
          onClick={() => goToPage(pageNumber - 1)}
          disabled={pageNumber <= 1}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs tracking-[0.15em] uppercase border border-neutral-200 dark:border-white/10 disabled:opacity-30 hover:border-neutral-900 dark:hover:border-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </button>
        <div className="hidden sm:flex items-center gap-1.5 max-w-md overflow-x-auto px-2">
          {Array.from({ length: numPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => goToPage(n)}
              className={`w-2 h-2 rounded-full transition-colors ${
                n === pageNumber ? "bg-neutral-900 dark:bg-white" : "bg-neutral-900 dark:bg-white/20 hover:bg-neutral-900 dark:bg-white/40"
              }`}
              aria-label={`Go to page ${n}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => goToPage(pageNumber + 1)}
          disabled={!numPages || pageNumber >= numPages}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs tracking-[0.15em] uppercase border border-neutral-200 dark:border-white/10 disabled:opacity-30 hover:border-neutral-900 dark:hover:border-white transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
}
