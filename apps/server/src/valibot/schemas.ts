export function parseSearchQuery(query: unknown): string {
  if (typeof query !== 'string') {
    return '';
  }
  return query.trim();
}

export function parseLimitQuery(limit: unknown, defaultValue = 10): number {
  if (typeof limit !== 'string') {
    return defaultValue;
  }
  const parsed = parseInt(limit, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}
