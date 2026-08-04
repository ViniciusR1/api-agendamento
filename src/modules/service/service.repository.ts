import {ServiceEntity, CreateServiceDTO} from './service.types';

export interface ServiceRepository {
  findById(id: string):Promise<ServiceEntity | null>
  findByProfessional(professionalId: string):Promise<ServiceEntity[]>;
  create(data: CreateServiceDTO):Promise<ServiceEntity>;
}