export function truncateText(text: string | null, maxLength: number) {
  if (!text) {
    return null;
  }

  return text.length > maxLength
    ? text.slice(0, maxLength) + '...'
    : text;
}