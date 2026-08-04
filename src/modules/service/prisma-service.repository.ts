import { PrismaClient, Prisma } from '../../generated/prisma/client';
import { ServiceRepository } from './service.repository';
import { ServiceEntity, CreateServiceDTO } from './service.types';

export class PrismaServiceRepository implements ServiceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private toEntity(row: {
    id: string; name: string; durationInMinutes: number;
    price: Prisma.Decimal; professionalId: string;
  }): ServiceEntity {
    return { ...row, price: row.price.toString() };
  }

  async findById(id: string): Promise<ServiceEntity | null> {
    const row = await this.prisma.service.findUnique({ where: { id } });
    return row ? this.toEntity(row) : null;
  }

  async findByProfessional(professionalId: string): Promise<ServiceEntity[]> {
    const rows = await this.prisma.service.findMany({ where: { professionalId } });
    return rows.map((r) => this.toEntity(r));
  }

  async create(data: CreateServiceDTO): Promise<ServiceEntity> {
    const row = await this.prisma.service.create({ data });
    return this.toEntity(row);
  }
}