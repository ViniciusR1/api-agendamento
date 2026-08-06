import {PrismaClient} from '../../generated/prisma/client';
import {BlockedDateRepository} from './blocked-date.repository';
import {BlockedDateEntity, CreateBlockedDateDTO} from './blocked-date.types';

export class PrismaBlockedDateRepository implements BlockedDateRepository {
  constructor(private readonly prisma:PrismaClient) {}

  async existsForDate(professionalId: string, date: Date): Promise<boolean> {
    const found = await this.prisma.blockedDate.findUnique({
      where: {
        professionalId_date: {professionalId, date},
      },
    });
    return found !== null;
  }
  async findByProfessional(professionalId: string): Promise<BlockedDateEntity[]> {
    return this.prisma.blockedDate.findMany({
      where: {professionalId},
      select: {id: true, date: true, reason: true, professionalId: true},
    });
  }
  async create(data: Omit<CreateBlockedDateDTO, 'date'> & {date: Date}): Promise<BlockedDateEntity> {
   return this.prisma.blockedDate.create({
    data: {
      date: data.date,
      reason: data.reason,
      professionalId: data.professionalId,
    },
    select: {id: true, date: true, reason: true, professionalId: true},
   });
  }
}