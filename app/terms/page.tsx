import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function TermsPage() {
  return (
    <div className="min-h-screen page-atmosphere text-stone-800">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 pt-28 pb-16 space-y-6 relative z-10">
        <h1 className="font-display text-3xl font-semibold text-stone-900">Terms</h1>
        <p className="text-stone-600 leading-relaxed">
          Planova provides estimated trip costs and place suggestions for planning purposes only.
          Prices, availability, and OpenStreetMap listings can change. Always verify details with
          providers before booking. Hotel and restaurant links may become affiliate links in the
          future; today they are free referrals.
        </p>
        <Link href="/" className="inline-block text-teal-800 hover:text-teal-900 text-sm">
          ← Back home
        </Link>
      </main>
    </div>
  );
}
