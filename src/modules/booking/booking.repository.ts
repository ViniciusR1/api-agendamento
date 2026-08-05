import {BookingEntity} from './booking.types';

export interface BookingRepository {
  findConfirmedByProfessionalAndDateRange(
    professionalId: string,
    rangeStart: Date,
    rangeEnd: Date,
  ): Promise<BookingEntity[]>;
}