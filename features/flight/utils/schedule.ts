const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function weekdayOf(date: string) {
  return new Date(`${date}T00:00:00Z`).getUTCDay();
}

export function operatesOn(operatingDays: number[], date: string) {
  return !date || operatingDays.includes(weekdayOf(date));
}

export function formatOperatingDays(days: number[]) {
  const sorted = [...days].sort((a, b) => a - b);
  if (sorted.length === 7) return 'Daily';
  if (sorted.join() === '1,2,3,4,5') return 'Weekdays';
  if (sorted.join() === '0,6') return 'Weekends';
  return [1, 2, 3, 4, 5, 6, 0]
    .filter(day => sorted.includes(day))
    .map(day => DAY_LABELS[day])
    .join(', ');
}
