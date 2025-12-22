export function toLibya(date: Date) {
  // const d = new Date(date);
  // const utc = d.getTime();
  // const offset = d.getTimezoneOffset() / 60;
  // return new Date(utc - offset * 3600 * 1000);

  return new Date(date.toLocaleString('en-US', { timeZone: 'Africa/Tripoli' }));
}

export function dateOnlyKeyFromLibya(date: Date) {
  const lib = toLibya(date);
  return lib.toISOString().slice(0, 10);
}

export function parseTimeToDateOnLocal(date: string, timeStr: string): Date {
  const [h, m, s] = timeStr.split(':').map((n) => Number(n ?? 0)) as [
    number,
    number,
    number | undefined
  ];
  const d = new Date(date + 'T00:00:00Z');

  const libMidnight = toLibya(d);
  libMidnight.setHours(h, m, s ?? 0);
  return libMidnight;
}

export function iterateDates(startD: Date, endD: Date) {
  const arr = [];
  const cur = new Date(startD);

  while (cur <= endD) {
    arr.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }

  return arr;
}
