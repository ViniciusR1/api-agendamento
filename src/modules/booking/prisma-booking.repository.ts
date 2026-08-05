import {PrismaClient} from '../../generated/prisma/client';
import {BookingRepository} from './booking.repository';
import {BookingEntity} from './booking.types';

export class PrismaBookingRepository implements BookingRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findConfirmedByProfessionalAndDateRange(
    professionalId: string,
    rangeStart: Date,
    rangeEnd: Date,
  ): Promise<BookingEntity[]> {
    return this.prisma.booking.findMany({
      where: {
        professionalId,
        status: 'CONFIRMED',
        startTime: {gte: rangeStart, lte: rangeEnd},
      },
      select: {id: true, startTime: true, endTime: true, status: true},
    });
  }
}