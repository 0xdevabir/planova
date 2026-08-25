// components/Navbar.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { FaPlane } from "react-icons/fa";

const links = [
  { href: "/explore", label: "Explore" },
  { href: "/guides", label: "Guides" },
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/support", label: "Support" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-4 inset-x-0 z-50 flex justify-center px-3 sm:px-4">
      <div className="w-full max-w-5xl rounded-2xl px-4 sm:px-6 py-3 bg-white/90 backdrop-blur-md border border-stone-200/80 shadow-[0_10px_40px_rgba(28,25,23,0.08)]">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 text-stone-900 font-semibold">
            <div className="h-10 w-10 rounded-full bg-teal-700 text-white flex items-center justify-center">
              <FaPlane className="w-4 h-4" />
            </div>
            <span className="text-lg font-display">Planova</span>
          </Link>

          <div className="hidden md:flex items-center gap-1 ml-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-stone-600 hover:text-stone-900 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-stone-100"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Link
              href="/app-info"
              className="hidden sm:inline-flex items-center gap-2 bg-teal-700 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-teal-800 transition-colors"
            >
              Get the app
            </Link>
            <button
              className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-full border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors"
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

        <div className={`${open ? "grid" : "hidden"} md:hidden mt-3 gap-2 border-t border-stone-200 pt-3 text-sm text-stone-700`}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-stone-100 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/app-info"
            onClick={() => setOpen(false)}
            className="mt-1 inline-flex items-center justify-center gap-2 bg-teal-700 text-white px-4 py-3 rounded-xl font-semibold hover:bg-teal-800 transition-colors"
          >
            Get the app
          </Link>
        </div>
      </div>
    </nav>
  );
}

