import {prisma} from '../../lib/prisma';

import { PrismaProfessionalRepository } from '../../modules/professional/prisma-professional.repository';
import { ProfessionalService } from '../../modules/professional/professional.service';
import { ProfessionalController } from '../../modules/professional/professional.controller';

import {PrismaServiceRepository} from '../../modules/service/prisma-service.repository';
import {ServiceService} from '../../modules/service/service.service';
import {ServiceController} from '../../modules/service/service.controller';

import { PrismaAvailabilityRepository } from '../../modules/availability/prisma-availability.repository';
import { AvailabilityService } from '../../modules/availability/availability.service';
import {AvailabilityController} from "../../modules/availability/availability.controller";

import { PrismaBlockedDateRepository } from './../../modules/blocked-date/prisma-blocked-date.repository';
import { BlockedDateService } from './../../modules/blocked-date/blocked-date.service';
import {BlockedDateController} from "../../modules/blocked-date/blocked-date.controller";


export function buildContainer() {
  const professionalRepository = new PrismaProfessionalRepository(prisma);
  const professionalService = new ProfessionalService(professionalRepository);
  const professionalController = new ProfessionalController(professionalService);

  const serviceRepository = new PrismaServiceRepository(prisma);
  const serviceService = new ServiceService(serviceRepository);
  const serviceController = new ServiceController(serviceService);

  const availabilityRepository = new PrismaAvailabilityRepository(prisma);
  const availabilityService = new AvailabilityService(availabilityRepository);
  const availabilityController = new AvailabilityController(availabilityService);

  const blockedDateRepository = new PrismaBlockedDateRepository(prisma);
  const blockedDateService = new BlockedDateService(blockedDateRepository);
  const blockedDateController = new BlockedDateController(blockedDateService);

  return { professionalController, serviceController, availabilityController, blockedDateController };
}