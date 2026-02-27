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

export function formatRelativeTime(dateTime: FormattableDate, locale: string = 'en') {
  if (!dateTime){
    return null;
  }

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  const now = new Date();
  const target = new Date(dateTime);
  const diffSeconds = Math.floor((target.getTime() - now.getTime()) / 1000);

  const minutes = Math.floor(diffSeconds / 60);
  const hours = Math.floor(diffSeconds / 3600);
  const days = Math.floor(diffSeconds / 86400);
  const months = Math.floor(diffSeconds / 2592000);
  const years = Math.floor(diffSeconds / 31536000);

  if (Math.abs(minutes) < 60) return rtf.format(minutes, 'minute');
  if (Math.abs(hours) < 24) return rtf.format(hours, 'hour');
  if (Math.abs(days) < 30) return rtf.format(days, 'day');
  if (Math.abs(months) < 12) return rtf.format(months, 'month');

  return rtf.format(years, 'year');
}