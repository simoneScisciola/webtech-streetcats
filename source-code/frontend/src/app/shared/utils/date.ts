export function formatDate(dateTime: Date | null) {

  if (!dateTime) {
    return null;
  }

  return dateTime.toLocaleString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

}

export function formatTime(dateTime: Date | null) {

  if (!dateTime) {
    return null;
  }

  return dateTime.toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit'
  });

}
