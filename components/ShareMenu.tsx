// components/ShareMenu.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { FaShareAlt, FaLink, FaTwitter, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import useShare from "@/hooks/useShare";
import { useToast } from "@/hooks/useToast";

interface ShareMenuProps {
  url?: string;
  title?: string;
  description?: string;
}

export function ShareMenu({
  url,
  title = "Check out this Planova trip",
  description = "I planned this trip on Planova and thought you might like it.",
}: ShareMenuProps) {
  const [open, setOpen] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const ref = useRef<HTMLDivElement>(null);
  const toast = useToast();

  const shareUrl = typeof window !== "undefined" ? url || window.location.href : "";

  const share = useShare({
    onCopied: () => {
      setCopyState("copied");
      toast({ tone: "success", title: "Link copied", description: "Share away." });
      setTimeout(() => setCopyState("idle"), 2000);
    },
    onError: () => toast({ tone: "danger", title: "Couldn't copy", description: "Try a different browser." }),
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const encoded = encodeURIComponent(shareUrl);
  const text = encodeURIComponent(description);
  const subject = encodeURIComponent(title);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-label="Share"
        className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-cyan-400 hover:text-cyan-700 text-slate-700 px-3 py-2 rounded-full text-sm font-semibold transition-all"
      >
        <FaShareAlt /> Share
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-64 rounded-2xl bg-white shadow-2xl border border-slate-200 p-2 space-y-1">
          <button
            type="button"
            onClick={() => share({ title, text: description, url: shareUrl })}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-cyan-50 text-sm font-semibold text-slate-700 hover:text-cyan-700"
          >
            <FaLink className="text-cyan-600" />
            {copyState === "copied" ? "Link copied!" : "Copy link"}
          </button>
          <a
            href={`https://twitter.com/intent/tweet?url=${encoded}&text=${text}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-cyan-50 text-sm font-semibold text-slate-700 hover:text-cyan-700"
          >
            <FaTwitter className="text-sky-500" /> Twitter / X
          </a>
          <a
            href={`https://wa.me/?text=${text}%20${encoded}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-cyan-50 text-sm font-semibold text-slate-700 hover:text-cyan-700"
          >
            <FaWhatsapp className="text-emerald-500" /> WhatsApp
          </a>
          <a
            href={`mailto:?subject=${subject}&body=${text}%20${encoded}`}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-cyan-50 text-sm font-semibold text-slate-700 hover:text-cyan-700"
          >
            <FaEnvelope className="text-rose-500" /> Email
          </a>
        </div>
      )}
    </div>
  );
}

export default ShareMenu;