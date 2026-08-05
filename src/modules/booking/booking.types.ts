export interface BookingEntity {
  id: string;
  startTime: Date;
  endTime: Date;
  status: 'CONFIRMED' | 'CANCELED';
}