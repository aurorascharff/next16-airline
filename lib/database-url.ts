export function sqlitePath(url: string): string {
  return url.startsWith('file:') ? url.slice('file:'.length) : url;
}
