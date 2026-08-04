import {prisma} from '../../lib/prisma';
import { PrismaProfessionalRepository } from '../../modules/professional/prisma-professional.repository';
import { ProfessionalService } from '../../modules/professional/professional.service';
import { ProfessionalController } from '../../modules/professional/professional.controller';
import {PrismaServiceRepository} from '../../modules/service/prisma-service.repository';
import {ServiceService} from '../../modules/service/service.service';
import {ServiceController} from '../../modules/service/service.controller';

export function buildContainer() {
  const professionalRepository = new PrismaProfessionalRepository(prisma);
  const professionalService = new ProfessionalService(professionalRepository);
  const professionalController = new ProfessionalController(professionalService);

  const serviceRepository = new PrismaServiceRepository(prisma);
  const serviceService = new ServiceService(serviceRepository);
  const serviceController = new ServiceController(serviceService);

  return { professionalController, serviceController };
}