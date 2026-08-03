import {prisma} from '../../lib/prisma';
import { PrismaProfessionalRepository } from '../../modules/professional/prisma-professional.repository';
import { ProfessionalService } from '../../modules/professional/professional.service';
import { ProfessionalController } from '../../modules/professional/professional.controller';

export function buildContainer() {
  const professionalRepository = new PrismaProfessionalRepository(prisma);
  const professionalService = new ProfessionalService(professionalRepository);
  const professionalController = new ProfessionalController(professionalService);
  return { professionalController };
}