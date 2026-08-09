// lib/utils/money.ts
// Currency helpers. We treat every cost internally as USD cents-equivalent so
// that downstream services don't need to track FX, but the UI presents values
// in the user-selected currency with a friendly symbol and compact grouping.

export const CURRENCIES = [
  { code: "USD", symbol: "$", locale: "en-US", name: "US Dollar" },
  { code: "EUR", symbol: "€", locale: "en-IE", name: "Euro" },
  { code: "GBP", symbol: "£", locale: "en-GB", name: "British Pound" },
  { code: "JPY", symbol: "¥", locale: "ja-JP", name: "Japanese Yen" },
  { code: "AUD", symbol: "A$", locale: "en-AU", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", locale: "en-CA", name: "Canadian Dollar" },
  { code: "INR", symbol: "₹", locale: "en-IN", name: "Indian Rupee" },
  { code: "THB", symbol: "฿", locale: "en-TH", name: "Thai Baht" },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

// Approximate conversion rates relative to 1 USD. Refreshed occasionally;
// used only for display since estimators are USD-native.
const RATE_TO_USD: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 1.08,
  GBP: 1.27,
  JPY: 0.0067,
  AUD: 0.66,
  CAD: 0.74,
  INR: 0.012,
  THB: 0.029,
};

export function currencyMeta(code: string): (typeof CURRENCIES)[number] {
  return CURRENCIES.find((c) => c.code === code.toUpperCase()) ?? CURRENCIES[0];
}

/**
 * Format a USD-denominated amount in the user-selected currency.
 * Uses Intl.NumberFormat for proper grouping and locale-aware decimals.
 */
export function formatCurrency(amountUsd: number, currency: string = "USD"): string {
  const meta = currencyMeta(currency);
  const converted = amountUsd * RATE_TO_USD[meta.code];
  const formatter = new Intl.NumberFormat(meta.locale, {
    style: "currency",
    currency: meta.code,
    maximumFractionDigits: meta.code === "JPY" || meta.code === "THB" ? 0 : 0,
  });
  return formatter.format(converted);
}

/**
 * Compact currency format for chart axes / dense lists, e.g. `$1.2k`, `€15k`.
 */
export function formatCurrencyCompact(amountUsd: number, currency: string = "USD"): string {
  const meta = currencyMeta(currency);
  const converted = amountUsd * RATE_TO_USD[meta.code];
  const formatter = new Intl.NumberFormat(meta.locale, {
    notation: "compact",
    maximumFractionDigits: 1,
    style: "currency",
    currency: meta.code,
  });
  return formatter.format(converted);
}

/**
 * Round-trip currency helpers for "per person" math.
 */
export function perPerson(totalUsd: number, travelers: number): number {
  return travelers <= 0 ? totalUsd : totalUsd / travelers;
}