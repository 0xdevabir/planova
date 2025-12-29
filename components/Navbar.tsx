// components/Navbar.tsx

"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 bg-zinc-800/80 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-white/10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-white font-semibold pr-4">
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
          </svg>
          <span>Planova</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="#features"
            className="text-gray-300 hover:text-white px-3 py-1.5 rounded-full text-sm transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-gray-300 hover:text-white px-3 py-1.5 rounded-full text-sm transition-colors"
          >
            How it works
          </Link>
          <Link
            href="#testimonials"
            className="text-gray-300 hover:text-white px-3 py-1.5 rounded-full text-sm transition-colors"
          >
            Testimonials
          </Link>
          <Link
            href="#support"
            className="text-gray-300 hover:text-white px-3 py-1.5 rounded-full text-sm transition-colors"
          >
            Support
          </Link>
        </div>

        {/* CTA Button */}
        <button className="flex items-center gap-2 bg-white text-zinc-900 px-4 py-1.5 rounded-full text-sm font-medium ml-2 hover:bg-gray-100 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Get the app
        </button>
      </div>
    </nav>
  );
}
