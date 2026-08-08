import { prisma } from "../../lib/prisma";

// professional
import { PrismaProfessionalRepository } from "../../modules/professional/prisma-professional.repository";
import { ProfessionalService } from "../../modules/professional/professional.service";
import { ProfessionalController } from "../../modules/professional/professional.controller";

// service
import { PrismaServiceRepository } from "../../modules/service/prisma-service.repository";
import { ServiceService } from "../../modules/service/service.service";
import { ServiceController } from "../../modules/service/service.controller";

// availability
import { PrismaAvailabilityRepository } from "../../modules/availability/prisma-availability.repository";
import { AvailabilityService } from "../../modules/availability/availability.service";
import { AvailabilityController } from "../../modules/availability/availability.controller";

// blocked-date
import { PrismaBlockedDateRepository } from "../../modules/blocked-date/prisma-blocked-date.repository";
import { BlockedDateService } from "../../modules/blocked-date/blocked-date.service";
import { BlockedDateController } from "../../modules/blocked-date/blocked-date.controller";

// booking
import { PrismaBookingRepository } from "../../modules/booking/prisma-booking.repository";
import { BookingService } from "../../modules/booking/booking.service";
import { BookingController } from "../../modules/booking/booking.controller";

// scheduling (orquestrador de slots)
import { AvailableSlotsService } from "../../modules/scheduling/available-slots.service";
import { AvailableSlotsController } from "../../modules/scheduling/available-slots.controller";

export function buildContainer() {
  // professional
  const professionalRepository = new PrismaProfessionalRepository(prisma);
  const professionalService = new ProfessionalService(professionalRepository);
  const professionalController = new ProfessionalController(
    professionalService,
  );

  // service
  const serviceRepository = new PrismaServiceRepository(prisma);
  const serviceService = new ServiceService(serviceRepository);
  const serviceController = new ServiceController(serviceService);

  // availability
  const availabilityRepository = new PrismaAvailabilityRepository(prisma);
  const availabilityService = new AvailabilityService(availabilityRepository);
  const availabilityController = new AvailabilityController(
    availabilityService,
  );

  // blocked-date
  const blockedDateRepository = new PrismaBlockedDateRepository(prisma);
  const blockedDateService = new BlockedDateService(blockedDateRepository);
  const blockedDateController = new BlockedDateController(blockedDateService);

  // booking
  const bookingRepository = new PrismaBookingRepository(prisma);
  const bookingService = new BookingService(bookingRepository, serviceRepository, professionalRepository);
  const bookingController = new BookingController(bookingService);

  // scheduling — depende dos 4 repositórios acima, não tem repositório próprio
  const availableSlotsService = new AvailableSlotsService(
    availabilityRepository,
    blockedDateRepository,
    bookingRepository,
    serviceRepository,
  );
  const availableSlotsController = new AvailableSlotsController(
    availableSlotsService,
  );

  return {
    professionalController,
    serviceController,
    availabilityController,
    blockedDateController,
    availableSlotsController,
    bookingController,
  };
}
