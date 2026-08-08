import { PrismaClient } from "../../generated/prisma/client"
import { ProfessionalRepository } from './professional.repository';
import { Professional, CreateProfessionalDTO } from "./professional.types";

export class PrismaProfessionalRepository implements ProfessionalRepository {
  constructor (private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Professional[]> {
    return this.prisma.professional.findMany({
      where: {deletedAt: null},
      select: {id: true, name: true, email: true, timezone: true},
    });
  }

  async findById(id: string): Promise<Professional | null> {
    return this.prisma.professional.findFirst({
      where: {id, deletedAt: null},
      select: {id: true, name: true, email: true, timezone: true},
    });
  }

  async findByEmail(email: string): Promise<Professional | null> {
    return this.prisma.professional.findFirst({
       where: {email, deletedAt: null},
      select: {id: true, name: true, email: true, timezone: true},
    });
  }

  async create(data: CreateProfessionalDTO): Promise<Professional> {
    return this.prisma.professional.create({
      data,
      select: {
        id: true, name: true, email: true, timezone: true
      }
    })
  }
}