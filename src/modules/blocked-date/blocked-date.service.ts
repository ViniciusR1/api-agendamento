import { BlockedDateRepository } from './blocked-date.repository';
import{CreateBlockedDateDTO} from './blocked-date.types';
import {BadRequestError} from '../../shared/errors/app-error';

export class BlockedDateService {
  constructor(private readonly repository: BlockedDateRepository) {}

  async create(data: CreateBlockedDateDTO) {
    if(!data.professionalId) {
      throw new BadRequestError('O professionalId é obrigatório');
    }
    const parsedDate = new Date(`${data.date}T00:00:00.000Z`);
    if(isNaN(parsedDate.getTime())) {
      throw new BadRequestError('A data deve estar no formato YYYY-MM-DD');
    }
    const alreadyBlocked = await this.repository.existsForDate(
      data.professionalId,
      parsedDate,      
    );
    if(alreadyBlocked) {
      throw new BadRequestError('Esta data já esta bloqueada para este profissional')
    }
    return this.repository.create({...data, date: parsedDate});
  }
  async listByProfessional(professionalId: string) {
    return this.repository.findByProfessional(professionalId);
  }
}