export type Weekday = 'SUNDAY' | 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY';

export interface AvailabilityEntity {
  id: string;
  weekday: Weekday;
  startTime: string;
  endTime: string;
  professionalId: string;
}

export interface CreateAvailabilityDTO {
  weekday: Weekday;
  startTime: string;
  endTime: string;
  professionalId: string;
}