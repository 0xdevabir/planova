import type { ReactNode } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export function GuideShell({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen page-atmosphere">
      <Navbar />
      <article className="max-w-3xl mx-auto px-4 pt-28 pb-16 relative z-10 space-y-8">
        <nav className="text-sm text-stone-500">
          <Link href="/" className="hover:text-teal-800">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/guides" className="hover:text-teal-800">
            Guides
          </Link>
          <span className="mx-2">/</span>
          <span className="text-stone-800">{eyebrow}</span>
        </nav>

        <header className="space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-teal-800">{eyebrow}</p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-stone-900 tracking-tight">
            {title}
          </h1>
          <p className="text-lg text-stone-600 leading-relaxed">{lead}</p>
        </header>

        <div className="prose-planova space-y-6 text-stone-700 leading-relaxed">{children}</div>

        <aside className="rounded-2xl bg-teal-800 text-white p-6 space-y-3">
          <h2 className="font-display text-2xl font-semibold">Try it in Planova</h2>
          <p className="text-teal-50/90 text-sm leading-relaxed">
            Search from your city, set a budget and dates, then open destinations for itineraries,
            hotels, and restaurants.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white text-teal-900 font-semibold hover:bg-stone-100"
            >
              Open trip planner
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-white/40 text-white font-semibold hover:bg-white/10"
            >
              Browse destinations
            </Link>
          </div>
        </aside>
      </article>
    </div>
  );
}

export function GuideH2({ children }: { children: ReactNode }) {
  return <h2 className="font-display text-2xl font-semibold text-stone-900 pt-2">{children}</h2>;
}
