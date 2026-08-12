import { toZonedTime } from "date-fns-tz";
import { AvailabilityWindow } from './../scheduling/slot.types';

function toMinutesOfDay(date: Date, timezone: string): number {
  const zoned = toZonedTime(date, timezone);
  return zoned.getHours() * 60 + zoned.getMinutes();
}

function timeStringToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function IsWithinAnyWindow(
  startTime: Date,
  endTime: Date,
  windows: AvailabilityWindow[],
  timezone: string,
): boolean {
  const startMinutes = toMinutesOfDay(startTime, timezone);
  const endMinutes = toMinutesOfDay(endTime, timezone);

  return windows.some((window) => {
    const windowStart = timeStringToMinutes(window.startTime);
    const windowEnd = timeStringToMinutes(window.endTime);
    return startMinutes >= windowStart && endMinutes <= windowEnd
  })

}
