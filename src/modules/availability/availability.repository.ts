import {AvailabilityEntity, CreateAvailabilityDTO, Weekday} from './availability.types';

export interface AvailabilityRepository {
  findByProfessionalAndWeekday(
    professionalId: string,
    weekday: Weekday,
  ): Promise<AvailabilityEntity[]>;
  create(data: CreateAvailabilityDTO): Promise<AvailabilityEntity>;
}