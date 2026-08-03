import { ProfessionalRepository } from './professional.repository';
import {CreateProfessionalDTO} from './professional.types';
import { NotFoundError, BadRequestError } from '../../shared/errors/app-error';

export class ProfessionalService {
  constructor (private readonly repository: ProfessionalRepository) {}

  async list () {
    return this.repository.findAll();
  }
  async getById(id: string) {
    const professional = await this.repository.findById(id);
    if(!professional) {
      throw new NotFoundError(`Professional ${id} not found`);
    }
    return professional;
  }
  async create(data: CreateProfessionalDTO) {
    if(!data.name?.trim() || !data.email?.trim()) {
      throw new BadRequestError('Nome e email é obrigatório');
    }
  const existing = await this.repository.findByEmail(data.email);
  if(existing) {
    throw new BadRequestError('Email já registrado');
  }
  return this.repository.create(data);
  }
}
