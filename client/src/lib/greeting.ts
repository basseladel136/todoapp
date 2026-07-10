/**
 * Time-of-day greeting, preserved from the original app's `getWelcome`.
 */
export function getGreeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour >= 0 && hour <= 5) return 'Time to sleep';
  if (hour > 5 && hour <= 12) return 'Good morning';
  if (hour > 12 && hour <= 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Sanitizes a display name, preserved from the original `getName`:
 * falls back to "user" for empty/too-short/email-like values.
 */
export function getDisplayName(name?: string): string {
  if (!name || name.length < 2 || name.includes('@') || name.includes('.')) {
    return 'user';
  }
  return name;
}
