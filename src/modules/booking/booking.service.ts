import { addMinutes } from "date-fns";
import {fromZonedTime} from 'date-fns-tz';
import { BookingRepository } from './booking.repository';
import { CreateBookingDTO } from "./booking.types";
import { ServiceRepository } from "../service/service.repository";
import { ProfessionalRepository } from './../professional/professional.repository';
import { AvailabilityRepository } from './../availability/availability.repository';
import { BlockedDateRepository } from "../blocked-date/blocked-date.repository";
import { isWithinAnyWindow } from "./booking-business-rules";
import { BadRequestError, ConflictError, NotFoundError } from "../../shared/errors/app-error";


const WEEKDAYS = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
] as const;

const MIN_CANCELLATION_NOTICE_MINUTES = 60;

export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly serviceRepository: ServiceRepository,
    private readonly professionalRespository: ProfessionalRepository,
    private readonly availabilityRepository: AvailabilityRepository,
    private readonly blockedDateRepository: BlockedDateRepository,
  ) {}

  async create(data: CreateBookingDTO) {
    // if(!data.clientName?.trim() ||  !data.clientEmail?.trim()) {
    //   throw new BadRequestError('Nome do cliente e e-mail são obrigatórios');
    // }
    const professional = await this.professionalRespository.findById(data.professionalId);
    if(!professional) {
      throw new NotFoundError(`Profissional ${data.professionalId} não encontrado`);
    }
    const service = await this.serviceRepository.findById(data.serviceId);
    if(!service) {
      throw new NotFoundError(`Serviço ${data.serviceId} não encontrado`);
    }
    if(service.professionalId !== data.professionalId) {
      throw new BadRequestError(`O serviço não pertence a este profissional`);
    }
    const startTime = fromZonedTime(data.startTime, professional.timezone);
    if(isNaN(startTime.getTime())) {
       throw new BadRequestError('A data inicial deve ser no formato AAAA-MM-DD:HH:mm:ss');
    }
    if(startTime.getTime() < Date.now()) {
      throw new BadRequestError('Não é possivel agendar um horário no passado')
    }
    const endTime = addMinutes(startTime, service.durationInMinutes);


    const isBlocked = await this.blockedDateRepository.existsForDate(
      data.professionalId,
      startTime,
    );
    if(isBlocked) {
      throw new ConflictError('Profissional não está disponivel nesta data');
    }
    const localWeekday = WEEKDAYS[
      new Date(startTime.toLocaleString('en-US', {timeZone: professional.timezone})).getDay()
    ];
    const windows = await this.availabilityRepository.findByProfessionalAndWeekday(
      data.professionalId,
      localWeekday,
    );
    if(!isWithinAnyWindow(startTime, endTime, windows, professional.timezone)) {
      throw new ConflictError('Profissional não está disponivel neste horário');
    }

    return this.bookingRepository.create({
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      startTime,
      endTime,
      professionalId: data.professionalId,
      serviceId: data.serviceId
    })
  }

  async cancel(bookingId: string) {
    const booking = await this.bookingRepository.findById(bookingId);
    if(!booking){
      throw new NotFoundError(`Reserva ${bookingId} não encontrada`);
    }
    if(booking.status === 'CANCELED') {
      throw new BadRequestError('A reserva está cancelada');
    }
    const minutesUntilStart = (booking.startTime.getTime() - Date.now()) / 60000;
    if(minutesUntilStart < MIN_CANCELLATION_NOTICE_MINUTES) {
      throw new BadRequestError(
        `A reserva deve ser cancelada com ${MIN_CANCELLATION_NOTICE_MINUTES} minutos de antecedência`,
      );
    }
    return this.bookingRepository.cancel(bookingId);
  }
}
