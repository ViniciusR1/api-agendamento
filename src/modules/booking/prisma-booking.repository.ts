import {PrismaClient, Prisma} from '../../generated/prisma/client';
import {BookingRepository} from './booking.repository';
import {BookingEntity, CreateBookingDTO} from './booking.types';
import { ConflictError } from '../../shared/errors/app-error';

type CreateBookingInput = Omit<CreateBookingDTO, 'startTime'> & {startTime: Date; endTime: Date}

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
    });
  }

  async create(data: CreateBookingInput): Promise<BookingEntity> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        // verificacao otimista dentro da transacao - não é a garantia final,
        // mas evita bater no banco com insert  óbvio de conflito na maioria dos casos
        const conflicting = await tx.booking.findFirst({
          where: {
            professionalId: data.professionalId,
            status: 'CONFIRMED',
            startTime: {lt: data.endTime},
            endTime: {gt: data.startTime},
          },
        });
        if(conflicting) {
          throw new ConflictError('Este horario não está mais disponivel');
        }
        // A escrita real. Se outro request 'vencer a corrida' entre o findFirst,
        // acima a este create, é a constraint única do banco que impede o insert
        return tx.booking.create({
          data: {
            clientName: data.clientName,
            clientEmail: data.clientEmail,
            startTime: data.startTime,
            endTime: data.endTime,
            professionalId: data.professionalId,
            serviceId: data.serviceId,
          },
        });
      });
    } catch (error) {
      //P2002 = 'Unique constraint failed' - é o codigo que o prisma usa
      // quando a constraint @@unique([professionalId, startTime]) barra o insert.
      if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictError('Este horário não está mais disponível');
      }  
      throw error
    }
  }
  async findById(id: string): Promise<BookingEntity | null> {
    return this.prisma.booking.findUnique({where: {id}})
  }

  async cancel(id: string): Promise<BookingEntity> {
    return this.prisma.booking.update({
      where: {id},
      data: {status: 'CANCELED', canceledAt: new Date()}
    })
  }
}