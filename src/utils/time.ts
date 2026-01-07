import { logger } from '../utils/logger.js';
export function toLibya(date: Date) {
  // const d = new Date(date);
  // const utc = d.getTime();
  // const offset = d.getTimezoneOffset() / 60;
  // return new Date(utc - offset * 3600 * 1000);

  return new Date(date.toLocaleString('en-US', { timeZone: 'Africa/Tripoli' }));
}

export function toLibyaTest(date: Date) {
  // logger.info('testing converting to libya time', {
  //   service: 'time-utils',
  //   date,
  //   result: new Date(
  //     date.toLocaleString('en-US', { timeZone: 'Africa/Tripoli' })
  //   ),
  // });
  return new Date(date.toLocaleString('en-US', { timeZone: 'Africa/Tripoli' }));
}

export function dateOnlyKeyFromLibya(date: Date) {
  const lib = toLibya(date);
  return lib.toISOString().slice(0, 10);
}

export function parseTimeToDateOnLocal(date: string, timeStr: string): Date {
  const [h, m, s = 0] = timeStr.split(':').map(Number);

  // Create date directly in LOCAL time (Libya server time)
  const d = new Date(
    `${date}T${String(h).padStart(2, '0')}:${String(m).padStart(
      2,
      '0'
    )}:${String(s).padStart(2, '0')}`
  );

  if (isNaN(d.getTime())) {
    throw new Error('Invalid date or time');
  }

  // logger.info('parsing time to local', {
  //   service: 'time-utils',
  //   d,
  //   h,
  //   m,
  //   s,
  // });

  return d;
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

export function toPgTime(date: Date | null | undefined): string | null {
  if (!date) return null;
  return date.toISOString().substring(11, 19); // HH:mm:ss
}

export function toMinutes(ms: number) {
  return Math.round(ms / 60000);
}
