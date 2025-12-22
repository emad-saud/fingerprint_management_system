import {
  type Employee,
  type RawAttendance,
  type Shift,
  Overtime,
  type PublicHoliday,
  ShiftDay,
} from '../models/index.js';
import { logger } from '../utils/logger.js';

import { type ProcessedLog } from '../utils/groupLogs.js';

import { parseTimeToDateOnLocal, toLibya } from '../utils/time.js';
import type { ShiftAssignmentAttributes } from '../types/shiftAssignmentTypes.js';
import type { ShiftDayAttributes } from '../types/shiftDayTypes.js';

export function processOneDay({
  emp,
  dateKey,
  logsForDay,
  shift,
  shiftDay,
  overtimeRecord,
  holiday,
  assignment,
}: {
  emp: InstanceType<typeof Employee>;
  dateKey: string;
  // logsForDay: InstanceType<typeof RawAttendance>[];
  logsForDay: ProcessedLog[];
  shift: InstanceType<typeof Shift>;
  shiftDay: ShiftDayAttributes | undefined;
  overtimeRecord: InstanceType<typeof Overtime> | undefined;
  holiday: InstanceType<typeof PublicHoliday> | undefined;
  assignment: ShiftAssignmentAttributes;
}) {
  logsForDay.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  const punches = (logsForDay || [])
    .map((l) => {
      const lib = toLibya(new Date(l.timestamp));
      return { ...l, localTimeStamp: lib };
    })
    .sort((a, b) => a.localTimeStamp.getTime() - b.localTimeStamp.getTime());

  const firstPunch = punches[0]?.localTimeStamp || null;
  const lastPunch = punches[punches.length - 1]?.localTimeStamp || null;

  const dateObj = new Date(dateKey);

  // const assignment = emp.shiftAssignments.find((a) => {
  //   const from = new Date(a.validFrom);
  //   const to = a.validTo ? new Date(a.validTo) : null;

  //   return from <= dateObj && (!to || dateObj <= to);
  // });
  if (!assignment)
    return {
      empId: emp.empId,
      date: dateKey,
      status: 'NO_SHIFT',
      firstPunch,
      lastPunch,
      // overtimeMinutes: getOvertime(overtime, emp.empId, dateKey),
      overtimeMinutes: overtimeRecord?.durationMinutes ?? 0,
    };

  // const shift = shifts.find((s) => s.id === assignment.shiftId);

  const dayName = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][
    dateObj.getDay()
  ];

  // const shiftDay = shift?.shiftDays.find((d) => d.dayOfWeek === dayName);

  const effectiveStart = shiftDay?.startTime
    ? shiftDay.startTime
    : shift?.startTime;
  const effectiveEnd = shiftDay?.endTime ? shiftDay.endTime : shift?.endTime;

  const requiredMinutes = minutesBetween(
    effectiveStart?.toString() || '00:00',
    effectiveEnd?.toString() || '00:00'
  );

  const isHoliday = !!holiday;

  if (isHoliday) {
    const workedMinutes = requiredMinutes;
    const holidayMinutes = requiredMinutes;
    const overtimeMinutes = overtimeRecord?.durationMinutes ?? 0;
    const netMinutes = workedMinutes + holidayMinutes + overtimeMinutes;

    return {
      empId: emp.empId,
      date: dateKey,
      shiftId: shift?.id,
      shiftDayId: shiftDay?.id,
      dayName,
      firstPunch,
      lastPunch,
      checkIn: null,
      checkOut: null,
      requiredMinutes,
      workedMinutes,
      overtimeMinutes,
      holidayMinutes,
      netMinutes,
      detailsJson: {
        reason: 'PUBLIC_HOLIDAY_OR_APPROVED_LEAVE',
        holiday,
        overtimeRecord,
      },
    };
  }

  const shiftStart = parseTimeToDateOnLocal(dateKey, effectiveStart as string);
  const shiftEnd = parseTimeToDateOnLocal(dateKey, effectiveEnd as string);

  if (shiftDay?.isOffDuty) {
    const requiredMinutes = Math.round(
      (shiftDay.endTime.getTime() - shiftDay.startTime.getTime()) / 60000
    );
    return {
      empId: emp.empId,
      date: dateKey,
      shiftId: shift?.id,
      shiftDayId: shiftDay.id,
      dayName,
      firstPunch,
      lastPunch,
      checkIn: null,
      checkOut: null,
      requiredMinutes,
      workedMinutes: requiredMinutes,
      overtimeMinutes: overtimeRecord?.durationMinutes ?? 0,
      holidayMinutes: 0,
      netMinutes: requiredMinutes + (overtimeRecord?.durationMinutes ?? 0),
    };
  }

  if (!firstPunch) {
    return {
      empId: emp.empId,
      date: dateKey,
      shiftId: shift?.id,
      shiftDayId: shiftDay?.id,
      dayName,
      firstPunch,
      lastPunch,
      checkIn: null,
      checkOut: null,
      requiredMinutes,
      workedMinutes: 0,
      overtimeMinutes: overtimeRecord?.durationMinutes ?? 0,
      holidayMinutes: 0,
      netMinutes: overtimeRecord?.durationMinutes ?? 0,
      detailsJson: {
        reason: 'ABSENT',
        overtimeRecord,
      },
    };
  }

  if (punches.length <= 1) {
    return {
      empId: emp.empId,
      date: dateKey,
      shiftId: shift?.id,
      shiftDayId: shiftDay?.id,
      dayName,
      firstPunch,
      lastPunch,
      checkIn: Math.max(firstPunch.getTime() ?? 0, shiftStart.getTime()),
      checkOut: null,
      requiredMinutes,
      workedMinutes: 0,
      holidayMinutes: 0,
      overtimeMinutes: overtimeRecord?.durationMinutes ?? 0,
      netMinutes: overtimeRecord?.durationMinutes ?? 0,
      detailsJson: {
        reason: 'FORGOTTEN_CHECK-IN/OUT',
        overtimeRecord,
      },
    };
  }

  const gracePeriodIn = shiftDay
    ? shiftDay.gracePeriodIn
    : shift!.gracePeriodIn;
  const gracePeriodOut = shiftDay
    ? shiftDay.gracePeriodOut
    : shift!.gracePeriodOut;

  const checkIn = Math.max(firstPunch.getTime(), shiftStart.getTime());
  const checkOut = Math.min(lastPunch?.getTime() ?? 0, shiftEnd.getTime());

  const lateIn = Math.max(
    0,
    checkIn - gracePeriodIn * 60 * 1000 - shiftStart.getTime()
  );
  const lateOut = Math.max(0, lastPunch?.getTime() ?? 0 - shiftEnd.getTime());

  const earlyIn = Math.min(0, shiftStart.getTime() - firstPunch.getTime());
  const earlyOut = Math.min(
    0,
    shiftEnd.getTime() - (checkOut + gracePeriodOut * 60 * 1000)
  );
  // const workedMinutes =
  //   holiday || shiftDay?.isOffDuty
  //     ? (shiftEnd.getTime() - shiftStart.getTime()) / 60000
  //     : Math.max(0, Math.round((checkIn - checkOut) / 60000));

  const workedMinutes = Math.max(0, Math.round((checkOut - checkIn) / 60000));

  if (emp.empId === 71) {
    const overtimeMinutes = overtimeRecord?.durationMinutes ?? 0;
    logger.info('processing my attendance!', {
      service: 'attendance-engine',
      processedAtt: {
        empId: emp.empId,
        dateKey,
        shiftId: shift?.id,
        shiftDayId: shiftDay?.id,
        dayName,
        firstPunch,
        lastPunch,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        requiredMinutes,
        workedMinutes,
        overtimeMinutes,
        cIn: checkIn,
        cOut: checkOut,
        wMin: (checkOut - checkIn) / 60000,
      },
    });
  }

  return {
    empId: emp.empId,
    date: dateKey,
    shiftId: shift?.id,
    shiftDayId: shiftDay?.id,
    dayName,
    firstPunch,
    lastPunch,
    checkIn: new Date(checkIn),
    checkOut: new Date(checkOut),
    workedMinutes,
    overtimeMinutes: overtimeRecord?.durationMinutes ?? 0,
    earlyIn,
    earlyOut,
    lateIn,
    lateOut,
  };
}

// function getOvertime(
//   overtimeList: InstanceType<typeof Overtime>[],
//   empId: number,
//   date: string
// ) {
//   const row = overtimeList.find((o) => o.empId === empId && o.date === date);
//   return row?.durationMinutes ?? 0;
// }

function minutesBetween(timeA: string, timeB: string) {
  const [ha, ma] = timeA.split(':').map(Number) as [number, number];
  const [hb, mb] = timeB.split(':').map(Number) as [number, number];

  return hb * 60 + mb - (ha * 60 + ma);
}

function makeDate(base: Date, time: string) {
  logger.info('Making Date', {
    service: 'process-one-day',
    base,
    time,
  });

  const [h, m, s] = time.split(':').map(Number) as [number, number, number];
  const d = new Date(base);
  d.setHours(h, m, s ?? 0, 0);
  return d;
}
