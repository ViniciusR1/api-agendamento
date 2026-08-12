import {BookingEntity, CreateBookingDTO} from './booking.types';

export interface BookingRepository {
  findById(id: string): Promise<BookingEntity | null>
  findConfirmedByProfessionalAndDateRange(
    professionalId: string,
    rangeStart: Date,
    rangeEnd: Date,
  ): Promise<BookingEntity[]>;

  create(data: Omit<CreateBookingDTO, 'startTime'> & {startTime: Date; endTime: Date}): Promise<BookingEntity>

  cancel(id:string):Promise<BookingEntity>;
}