// lib/utils/dates.ts
// Date utilities tailored for travel planning. All inputs are JS Date objects;
// output is formatted strings for UI rendering.

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAY_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Whole-day count between two dates (treats both as midnight local time).
 * Always returns at least 1 so single-day trips don't break downstream code.
 */
export function dayCount(start: Date | string, end: Date | string): number {
  const s = typeof start === "string" ? new Date(start) : start;
  const e = typeof end === "string" ? new Date(end) : end;
  const diff = Math.round((e.getTime() - s.getTime()) / MS_PER_DAY);
  return Math.max(1, diff);
}

/**
 * Friendly short date range, e.g. `Mar 14 - Mar 21`. Falls back to long
 * format if the two dates span different years.
 */
export function formatDateRange(start: Date | string, end: Date | string): string {
  const s = typeof start === "string" ? new Date(start) : start;
  const e = typeof end === "string" ? new Date(end) : end;
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  const sameYear = s.getFullYear() === e.getFullYear();

  if (sameMonth) {
    return `${MONTH_SHORT[s.getMonth()]} ${s.getDate()} - ${e.getDate()}`;
  }
  if (sameYear) {
    return `${MONTH_SHORT[s.getMonth()]} ${s.getDate()} - ${MONTH_SHORT[e.getMonth()]} ${e.getDate()}`;
  }
  return `${MONTH_SHORT[s.getMonth()]} ${s.getDate()}, ${s.getFullYear()} - ${MONTH_SHORT[e.getMonth()]} ${e.getDate()}, ${e.getFullYear()}`;
}

/**
 * Long form for itinerary days and detail screens, e.g. `Saturday, March 14`.
 */
export function formatLongDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return `${WEEKDAY_LONG[d.getDay()]}, ${MONTH_LONG[d.getMonth()]} ${d.getDate()}`;
}

/**
 * Short day-of-week, e.g. `Sat`.
 */
export function formatWeekday(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return WEEKDAY_SHORT[d.getDay()];
}

/**
 * Stable ISO date string for caching keys and form defaults.
 */
export function toIsoDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().split("T")[0];
}

/**
 * Add days to a date and return a new Date.
 */
export function addDays(date: Date | string, days: number): Date {
  const d = typeof date === "string" ? new Date(date) : new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Returns a normalized date range that always returns positive days.
 */
export function normalizeDateRange(start: string, end: string): { start: string; end: string } {
  const s = new Date(start);
  const e = new Date(end);
  if (e < s) {
    return { start: toIsoDate(e), end: toIsoDate(s) };
  }
  return { start, end };
}