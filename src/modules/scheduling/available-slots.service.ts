import { startOfDay, endOfDay } from "date-fns";
import { AvailabilityRepository } from "../availability/availability.repository";
import { BlockedDateRepository } from "../blocked-date/blocked-date.repository";
import { BookingRepository } from "../booking/booking.repository";
import { ServiceRepository } from "../service/service.repository";
import { ProfessionalRepository } from './../professional/professional.repository';
import {
  generateSlotsForWindow,
  removeConflictingSlots,
} from "./slot-generator";
import { TimeSlot } from "./slot.types";
import { BadRequestError, NotFoundError } from "../../shared/errors/app-error";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

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
    private readonly professionalRespository: ProfessionalRepository,
  ) {}

  async getAvailableSlots(
    professionalId: string,
    serviceId: string,
    dateOnly: string,
  ): Promise<TimeSlot[]> {

    const professional = await this.professionalRespository.findById(professionalId);
    if(!professional) throw new NotFoundError(`Profissional ${professionalId} não encontrado`)

    const service = await this.serviceRepository.findById(serviceId);
    if (!service)
      throw new NotFoundError(`Serviço ${serviceId} não encontrado`);
    if (service.professionalId !== professionalId) {
      throw new BadRequestError("O serviço não pertence a este profissional");
    }
    const referenceDate = fromZonedTime(`${dateOnly}T00:00:00`, professional.timezone)

    const isBlocked = await this.blockedDateRepository.existsForDate(
      professionalId,
      referenceDate,
    );
    if (isBlocked) return [];

    const weekday = WEEKDAYS[toZonedTime(referenceDate, professional.timezone).getDay()];
    const windows =
      await this.availabilityRepository.findByProfessionalAndWeekday(
        professionalId,
        weekday,
      );
    if (!windows.length) return [];

    const rawSlots = windows.flatMap((window) =>
      generateSlotsForWindow(dateOnly, window, service.durationInMinutes, professional.timezone),
    );

    const rangeStart = fromZonedTime(`${dateOnly}T00:00:00`, professional.timezone );
    const rangeEnd = fromZonedTime(`${dateOnly}T23:59:59:999`, professional.timezone);
    const occupied =
      await this.bookingRepository.findConfirmedByProfessionalAndDateRange(
        professionalId,
        rangeStart,
        rangeEnd,
      );
    return removeConflictingSlots(rawSlots, occupied);
  }
}
