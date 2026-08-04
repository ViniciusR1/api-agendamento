import {ServiceRepository} from './service.repository';
import {CreateServiceDTO} from './service.types';
import {BadRequestError, NotFoundError} from '../../shared/errors/app-error';

export class ServiceService {
  constructor(private readonly repository: ServiceRepository) {}

  async getById(id: string) {
    const service = await this.repository.findById(id);
    if (!service) throw new NotFoundError(`Serviço ${id} não encontrado`);
    return service;
  }

  async listByProfessional(professionalId: string) {
    return this.repository.findByProfessional(professionalId);
  }

  async create(data: CreateServiceDTO) {
    if (!data.name?.trim()) throw new BadRequestError('Nome é obrigatório');
    if (!data.durationInMinutes || data.durationInMinutes <= 0) {
      throw new BadRequestError('A duração em minutos deve ser maior que zero');
    }
    if (data.price == null || data.price < 0) {
      throw new BadRequestError('O preço não pode ser negativo');
    }
    return this.repository.create(data);
  }
}