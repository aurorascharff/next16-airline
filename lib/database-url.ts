// pg >= 8.13 deprecates the `prefer|require|verify-ca` sslmode aliases, so force full
// verification unless SSL is explicitly disabled (the CI service container).
export function normalizeDatabaseUrl(url: string): string {
  const parsed = new URL(url);
  if (parsed.searchParams.get('sslmode') !== 'disable') {
    parsed.searchParams.set('sslmode', 'verify-full');
  }
  return parsed.toString();
}
