import {BlockedDateEntity ,CreateBlockedDateDTO } from './blocked-date.types';

export interface BlockedDateRepository {
  existsForDate(professionalId: string, date: Date): Promise<boolean>;
  findByProfessional(professionalId: string): Promise<BlockedDateEntity[]>;
  create(data: Omit<CreateBlockedDateDTO, 'date'> & {date: Date}):Promise<BlockedDateEntity>;
}
