import { addMinutes } from "date-fns";
import { BookingRepository } from './booking.repository';
import { CreateBookingDTO } from "./booking.types";
import { ServiceRepository } from "../service/service.repository";
import { ProfessionalRepository } from './../professional/professional.repository';
import { BadRequestError } from "../../shared/errors/app-error";
import {fromZonedTime} from 'date-fns-tz';


export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly serviceRepository: ServiceRepository,
    private readonly professionalRespository: ProfessionalRepository,
  ) {}

  async create(data: CreateBookingDTO) {
    if(!data.clientName?.trim() ||  !data.clientEmail?.trim()) {
      throw new BadRequestError('Nome do cliente e e-mail são obrigatórios');
    }
    const professional = await this.professionalRespository.findById(data.professionalId);
    if(!professional) {
      throw new BadRequestError(`Profissional ${data.professionalId} não encontrado`);
    }
    const service = await this.serviceRepository.findById(data.serviceId);
    if(!service) {
      throw new BadRequestError(`Serviço ${data.serviceId} não encontrado`);
    }
    if(service.professionalId !== data.professionalId) {
      throw new BadRequestError(`O serviço não pertence a este profissional`);
    }
    const startTime = fromZonedTime(data.startTime, professional.timezone);
    if(isNaN(startTime.getTime())) {
       throw new BadRequestError('A data inicial deve ser uma data ISO 8601 válida');
    }
    if(startTime.getTime() < Date.now()) {
      throw new BadRequestError('Não é possivel agendar um horário no passado')
    }
    const endTime = addMinutes(startTime, service.durationInMinutes);

    return this.bookingRepository.create({
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      startTime,
      endTime,
      professionalId: data.professionalId,
      serviceId: data.serviceId
    })
  }
}