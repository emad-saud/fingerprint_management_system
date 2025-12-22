import { toLibya } from './time.js';
import { type RawAttendance } from '../models/index.js';

export interface GroupedLogs {
  [empId: number]: {
    [date: string]: ProcessedLog[];
  };
}

export interface ProcessedLog {
  id: string | number; // depending on your DB
  empId: number;
  deviceId: number | undefined;
  type: string;
  timestamp: Date; // converted to Libya time
}

export function groupLogs(rawLogs: InstanceType<typeof RawAttendance>[]) {
  const grouped: GroupedLogs = {};

  for (const log of rawLogs) {
    const ts = toLibya(log.timestamp);
    // const ts = log.timestamp;

    const dateKey = ts.toISOString().slice(0, 10);

    if (!grouped[log.empId]) grouped[log.empId] = {};
    if (!grouped[log.empId]![dateKey]) grouped[log.empId]![dateKey] = [];

    grouped[log.empId]![dateKey]?.push({ ...log, timestamp: ts });
  }

  return grouped;
}
