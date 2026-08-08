import { startOfDay, endOfDay } from "date-fns";
import { AvailabilityRepository } from "../availability/availability.repository";
import { BlockedDateRepository } from "../blocked-date/blocked-date.repository";
import { BookingRepository } from "../booking/booking.repository";
import { ServiceRepository } from "../service/service.repository";
import {
  generateSlotsForWindow,
  removeConflictingSlots,
} from "./slot-generator";
import { TimeSlot } from "./slot.types";
import { BadRequestError, NotFoundError } from "../../shared/errors/app-error";

const WEEKDAYS = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
] as const;

export class AvailableSlotsService {
  constructor(
    private readonly availabilityRepository: AvailabilityRepository,
    private readonly blockedDateRepository: BlockedDateRepository,
    private readonly bookingRepository: BookingRepository,
    private readonly serviceRepository: ServiceRepository,
  ) {}

  async getAvailableSlots(
    professionalId: string,
    serviceId: string,
    date: Date,
  ): Promise<TimeSlot[]> {
    const service = await this.serviceRepository.findById(serviceId);
    if (!service)
      throw new NotFoundError(`Serviço ${serviceId} não encontrado`);
    if (service.professionalId !== professionalId) {
      throw new BadRequestError("O serviço não pertence a este profissional");
    }
    const isBlocked = await this.blockedDateRepository.existsForDate(
      professionalId,
      date,
    );
    if (isBlocked) return [];

    const weekday = WEEKDAYS[date.getUTCDay()];
    const windows =
      await this.availabilityRepository.findByProfessionalAndWeekday(
        professionalId,
        weekday,
      );
    if (!windows.length) return [];

    const rawSlots = windows.flatMap((window) =>
      generateSlotsForWindow(date, window, service.durationInMinutes),
    );

    const rangeStart = startOfDay(date);
    const rangeEnd = endOfDay(date);
    const occupied =
      await this.bookingRepository.findConfirmedByProfessionalAndDateRange(
        professionalId,
        rangeStart,
        rangeEnd,
      );
    return removeConflictingSlots(rawSlots, occupied);
  }
}
