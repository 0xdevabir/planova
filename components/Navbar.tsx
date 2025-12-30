// components/Navbar.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { FaPlane } from "react-icons/fa";

const links = [
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/support", label: "Support" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-4 inset-x-0 z-50 flex justify-center px-3 sm:px-4">
      <div className="w-full max-w-5xl rounded-full px-4 sm:px-6 py-3 bg-black/35 backdrop-blur-2xl border border-white/12 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 text-white font-semibold">
            <div className="h-10 w-10 rounded-full bg-white/15 border border-white/20 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
              <FaPlane className="w-5 h-5" />
            </div>
            <span className="text-lg">Planova</span>
          </Link>

          <div className="hidden md:flex items-center gap-1 ml-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/85 hover:text-white px-3 py-2 rounded-full text-sm transition-colors hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Link
              href="/app-info"
              className="hidden sm:inline-flex items-center gap-2 bg-white text-zinc-900 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Get the app
            </Link>
            <button
              className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/20 text-white/85 hover:text-white hover:border-white/40 transition-colors"
              onClick={() => setOpen((prev) => !prev)}
              aria-expanded={open}
              aria-label="Toggle navigation"
            >
              {!open ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className={`${open ? "grid" : "hidden"} md:hidden mt-3 gap-2 border-t border-white/12 pt-3 text-sm text-white/85`}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/10 transition-colors"
            >
              <span>{link.label}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
          <Link
            href="/app-info"
            onClick={() => setOpen(false)}
            className="mt-1 inline-flex items-center justify-center gap-2 bg-white text-zinc-900 px-4 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            <span>Get the app</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  );
}
