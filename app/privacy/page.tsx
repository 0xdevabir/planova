import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen page-atmosphere text-stone-800">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 pt-28 pb-16 space-y-6 relative z-10">
        <h1 className="font-display text-3xl font-semibold text-stone-900">Privacy</h1>
        <p className="text-stone-600 leading-relaxed">
          Planova stores favorites in your browser&apos;s local storage. Search queries are processed
          to return destination recommendations and are not sold to third parties. Map and place data
          may be requested from OpenStreetMap and optional Google Places when configured.
        </p>
        <p className="text-stone-500 text-sm">
          Contact us via the support page if you have questions about your data.
        </p>
        <Link href="/" className="inline-block text-teal-800 hover:text-teal-900 text-sm">
          ← Back home
        </Link>
      </main>
    </div>
  );
}
