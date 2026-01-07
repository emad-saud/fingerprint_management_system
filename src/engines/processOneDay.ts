import {
  type Employee,
  type Shift,
  Overtime,
  type PublicHoliday,
} from '../models/index.js';
import { logger } from '../utils/logger.js';

import { type ProcessedLog } from '../utils/groupLogs.js';

import {
  parseTimeToDateOnLocal,
  toLibya,
  toPgTime,
  toMinutes,
  toLibyaTest,
} from '../utils/time.js';
import type { ShiftAssignmentAttributes } from '../types/shiftAssignmentTypes.js';
import type { ShiftDayAttributes } from '../types/shiftDayTypes.js';
import type { ProcessedAttendanceRecordAtt } from '../types/processedAttendanceTypes.js';

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
}): ProcessedAttendanceRecordAtt {
  logsForDay.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  const punches = (logsForDay || [])
    .map((l) => {
      const lib = toLibyaTest(new Date(l.timestamp));
      // logger.info('sorting punches lol', {
      //   service: 'process-one-day',
      //   log: l.timestamp,
      //   lib,
      // });
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
      firstPunch: toPgTime(firstPunch),
      lastPunch: toPgTime(lastPunch),
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
      dayName: dayName ?? 'UNKNOWN_DAY',
      firstPunch: toPgTime(firstPunch),
      lastPunch: toPgTime(lastPunch),
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

  // logger.info('see what happens here', {
  //   service: 'process-one-day',
  //   shiftStart,
  //   shiftEnd,
  //   firstPunch,
  //   lastPunch,
  //   effectiveStart,
  //   effectiveEnd,
  // });

  if (shiftDay?.isOffDuty) {
    const requiredMinutes = Math.round(
      (parseTimeToDateOnLocal(dateKey, shiftDay.endTime).getTime() -
        parseTimeToDateOnLocal(dateKey, shiftDay.startTime).getTime()) /
        60000
    );
    const overtimeMinutes = overtimeRecord?.durationMinutes ?? 0;

    return {
      empId: emp.empId,
      date: dateKey,
      shiftId: shift?.id,
      shiftDayId: shiftDay.id,
      dayName: dayName ?? 'UNKNOWN_DAY',
      firstPunch: toPgTime(firstPunch),
      lastPunch: toPgTime(lastPunch),
      checkIn: null,
      checkOut: null,
      requiredMinutes,
      workedMinutes: requiredMinutes,
      overtimeMinutes: overtimeMinutes,
      holidayMinutes: 0,
      netMinutes: requiredMinutes + overtimeMinutes,
    };
  }

  if (!firstPunch) {
    return {
      empId: emp.empId,
      date: dateKey,
      shiftId: shift?.id,
      shiftDayId: shiftDay?.id,
      dayName: dayName ?? 'UNKNOWN_DAY',
      firstPunch: toPgTime(firstPunch),
      lastPunch: toPgTime(lastPunch),
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
      dayName: dayName ?? 'UNKNOWN_DAY',
      firstPunch: toPgTime(firstPunch),
      lastPunch: toPgTime(lastPunch),
      checkIn: toPgTime(
        new Date(Math.max(firstPunch.getTime() ?? 0, shiftStart.getTime()))
      ),
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

  const gracePeriodInMs = gracePeriodIn * 60000;
  const gracePeriodOutMs = gracePeriodOut * 60000;
  const lateIn =
    checkIn - gracePeriodInMs - shiftStart.getTime() <= 0
      ? 0
      : checkIn - shiftStart.getTime();
  // const lateIn = Math.max(
  //   0,
  //   toMinutes(checkIn - gracePeriodInMinutes * 60 * 1000 - shiftStart.getTime())
  // );

  const lateOut = Math.max(
    0,
    toMinutes((lastPunch?.getTime() ?? 0) - shiftEnd.getTime())
  );

  const earlyIn = Math.max(
    0,
    toMinutes(shiftStart.getTime() - firstPunch.getTime())
  );

  const earlyOut =
    shiftEnd.getTime() - checkOut - gracePeriodOutMs <= 0
      ? 0
      : shiftEnd.getTime() - checkOut;
  // const earlyOut = Math.min(
  //   0,
  //   toMinutes(shiftEnd.getTime() - (checkOut + gracePeriodOut * 60 * 1000))
  // );

  const overtimeMinutes = overtimeRecord?.durationMinutes ?? 0;
  const workedMinutes = Math.max(0, Math.round((checkOut - checkIn) / 60000));

  if (emp.empId === 119) {
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
        shiftStart,
        shiftEnd,
      },
    });
  }

  return {
    empId: emp.empId,
    date: dateKey,
    shiftId: shift?.id,
    shiftDayId: shiftDay?.id,
    dayName: dayName ?? 'UNKNOWN_DAY',
    firstPunch: toPgTime(firstPunch),
    lastPunch: toPgTime(lastPunch),
    checkIn: toPgTime(new Date(checkIn)),
    checkOut: toPgTime(new Date(checkOut)),
    workedMinutes,
    overtimeMinutes: overtimeRecord?.durationMinutes ?? 0,
    requiredMinutes,
    netMinutes: workedMinutes + overtimeMinutes,
    earlyIn,
    earlyOut,
    lateIn,
    lateOut,
  };
}

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
