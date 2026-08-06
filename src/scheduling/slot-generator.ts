import {addMinutes, isBefore} from 'date-fns';
import {TimeSlot, AvailabilityWindow} from './slot.types';

function parseTimeToDate(baseDate: Date, time: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const result = new Date(baseDate);
  result.setUTCHours(hours, minutes, 0, 0);
  return result;
}

export function generateSlotsForWindow(
  date: Date,
  window: AvailabilityWindow,
  durationInMinutes: number,
): TimeSlot[] {
  const windowStart = parseTimeToDate(date, window.startTime);
  const windowEnd = parseTimeToDate(date, window.endTime);

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