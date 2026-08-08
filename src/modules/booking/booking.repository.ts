import {BookingEntity, CreateBookingDTO} from './booking.types';

export interface BookingRepository {
  findConfirmedByProfessionalAndDateRange(
    professionalId: string,
    rangeStart: Date,
    rangeEnd: Date,
  ): Promise<BookingEntity[]>;

  create(data: Omit<CreateBookingDTO, 'startTime'> & {startTime: Date; endTime: Date}): Promise<BookingEntity>
}