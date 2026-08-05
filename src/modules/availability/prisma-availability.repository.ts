import {PrismaClient} from "../../generated/prisma/client";
import {AvailabilityRepository} from "./availability.repository";
import {CreateAvailabilityDTO, AvailabilityEntity, Weekday} from "./availability.types";

export class PrismaAvailabilityRepository implements AvailabilityRepository {
  constructor(private readonly prisma: PrismaClient){}

  async findByProfessionalAndWeekday(professionalId: string, weekday: Weekday): Promise<AvailabilityEntity[]> {
    return this.prisma.availability.findMany({
      where: {professionalId, weekday},
      select: {id: true, weekday: true, startTime: true, endTime: true, professionalId: true},
    })
  }
  async create(data: CreateAvailabilityDTO): Promise<AvailabilityEntity> {
    return this.prisma.availability.create({
      data,
      select: {id: true, weekday: true, startTime: true, endTime: true, professionalId: true},
    });
  }
}