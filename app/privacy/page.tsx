import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen page-atmosphere text-slate-100">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 pt-28 pb-16 space-y-6 relative z-10">
        <h1 className="font-display text-3xl font-semibold text-white">Privacy</h1>
        <p className="text-slate-300 leading-relaxed">
          Planova stores favorites in your browser&apos;s local storage. Search queries are processed
          to return destination recommendations and are not sold to third parties. Map and place data
          may be requested from OpenStreetMap and optional Google Places when configured.
        </p>
        <p className="text-slate-400 text-sm">
          Contact us via the support page if you have questions about your data.
        </p>
        <Link href="/" className="inline-block text-cyan-300 hover:text-cyan-200 text-sm">
          ← Back home
        </Link>
      </main>
    </div>
  );
}
