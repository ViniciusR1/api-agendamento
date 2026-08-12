import {addMinutes, isBefore} from 'date-fns';
import {fromZonedTime} from 'date-fns-tz';
import {TimeSlot, AvailabilityWindow} from './slot.types';

function parseTimeToUTC(dateOnly: string, time: string, timezone: string): Date {
  const localDateTimeString = `${dateOnly}T${time}:00`;
  return fromZonedTime(localDateTimeString, timezone)
}

export function generateSlotsForWindow(
  dateOnly: string,
  window: AvailabilityWindow,
  durationInMinutes: number,
  timezone: string
): TimeSlot[] {
  const windowStart = parseTimeToUTC(dateOnly, window.startTime, timezone);
  const windowEnd = parseTimeToUTC(dateOnly, window.endTime, timezone);

  const slots: TimeSlot[]= [];
  let cursor = windowStart;

  while(true) {
    const slotEnd = addMinutes(cursor, durationInMinutes);
    if(!isBefore(slotEnd, windowEnd) && slotEnd.getTime() !== windowEnd.getTime()) {
      break;
    }
    slots.push({startTime: cursor, endTime: slotEnd});
    cursor = slotEnd;
  }
  return slots;
}

export function removeConflictingSlots(
  slots: TimeSlot[],
  occupied: TimeSlot[],  
): TimeSlot[] {
  return slots.filter((slot => {
    return !occupied.some((busy) => slotsOverlap(slot, busy));
  }));
}

function slotsOverlap(a: TimeSlot, b: TimeSlot): boolean {
  return a.startTime< b.endTime && b.startTime < a.endTime;
}