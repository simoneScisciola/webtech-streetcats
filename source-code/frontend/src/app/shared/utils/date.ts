type FormattableDate = Date | string | null;

export function formatDate(dateTime: FormattableDate) {

  if (!dateTime) {
    return null;
  }

  const target = new Date(dateTime);

  return target.toLocaleString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

}

export function formatTime(dateTime: FormattableDate) {

  if (!dateTime) {
    return null;
  }

  const target = new Date(dateTime);
  
  return target.toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit'
  });

}

const rtfCache = new Map<string, Intl.RelativeTimeFormat>();

function getRtf(locale: string): Intl.RelativeTimeFormat {
  if (!rtfCache.has(locale))
    rtfCache.set(locale, new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }));
  return rtfCache.get(locale)!;
}

export function formatRelativeTime(dateTime: FormattableDate, locale = 'en'): string | null {
  if (!dateTime) {
    return null;
  }

  const rtf = getRtf(locale);
  const diffSeconds = Math.trunc((new Date(dateTime).getTime() - Date.now()) / 1000);

  const minutes = Math.trunc(diffSeconds / 60);
  const hours = Math.trunc(diffSeconds / 3_600);
  const days = Math.trunc(diffSeconds / 86_400);
  const months = Math.trunc(diffSeconds / 2_592_000);
  const years = Math.trunc(diffSeconds / 31_536_000);

  if (Math.abs(minutes) < 60) return rtf.format(minutes, 'minute');
  if (Math.abs(hours) < 24) return rtf.format(hours, 'hour');
  if (Math.abs(days) < 30) return rtf.format(days, 'day');
  if (Math.abs(months) < 12) return rtf.format(months, 'month');

  return rtf.format(years, 'year');
}