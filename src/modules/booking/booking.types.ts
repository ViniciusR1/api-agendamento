export interface BookingEntity {
  id: string;
  clientName: string;
  clientEmail: string;
  startTime: Date;
  endTime: Date;
  status: 'CONFIRMED' | 'CANCELED';
  professionalId: string;
  serviceId: string;
}

export interface CreateBookingDTO {
  clientName: string;
  clientEmail: string;
  startTime: string;
  professionalId: string;
  serviceId: string;
}