import { BookingService } from './booking.service';
import { ConflictError, BadRequestError, NotFoundError } from '../../shared/errors/app-error';
import { BookingRepository } from './booking.repository';
import { ServiceRepository } from '../service/service.repository';
import { ProfessionalRepository } from '../professional/professional.repository';
import { AvailabilityRepository } from '../availability/availability.repository';
import { BlockedDateRepository } from '../blocked-date/blocked-date.repository';

function buildService(overrides: Partial<{
  bookingRepository: Partial<BookingRepository>;
  serviceRepository: Partial<ServiceRepository>;
  professionalRepository: Partial<ProfessionalRepository>;
  availabilityRepository: Partial<AvailabilityRepository>;
  blockedDateRepository: Partial<BlockedDateRepository>;
}> = {}) {
  const professional = { id: 'prof-1', name: 'Dra. Ana', email: 'ana@x.com', timezone: 'America/Recife' };
  const service = { id: 'serv-1', name: 'Consulta', durationInMinutes: 30, price: '150', professionalId: 'prof-1' };

  const professionalRepository = {
    findById: jest.fn().mockResolvedValue(professional),
    ...overrides.professionalRepository,
  } as ProfessionalRepository;

  const serviceRepository = {
    findById: jest.fn().mockResolvedValue(service),
    ...overrides.serviceRepository,
  } as ServiceRepository;

  const availabilityRepository = {
    findByProfessionalAndWeekday: jest.fn().mockResolvedValue([
      { id: 'a1', weekday: 'MONDAY', startTime: '09:00', endTime: '12:00', professionalId: 'prof-1' },
    ]),
    ...overrides.availabilityRepository,
  } as AvailabilityRepository;

  const blockedDateRepository = {
    existsForDate: jest.fn().mockResolvedValue(false),
    ...overrides.blockedDateRepository,
  } as BlockedDateRepository;

  const bookingRepository = {
    create: jest.fn().mockImplementation((data) => Promise.resolve({ id: 'booking-1', status: 'CONFIRMED', ...data })),
    ...overrides.bookingRepository,
  } as BookingRepository;

  const bookingService = new BookingService(
    bookingRepository,
    serviceRepository,
    professionalRepository,
    availabilityRepository,
    blockedDateRepository,
  );

  return { bookingService, bookingRepository, professionalRepository };
}

describe('BookingService.create', () => {
  const futureDateWithinWindow = '2026-08-17T09:30:00'; // segunda, dentro da janela mockada

  it('cria um booking quando tudo é válido', async () => {
    const { bookingService, bookingRepository } = buildService();

    await bookingService.create({
      clientName: 'João',
      clientEmail: 'joao@x.com',
      startTime: futureDateWithinWindow,
      professionalId: 'prof-1',
      serviceId: 'serv-1',
    });

    expect(bookingRepository.create).toHaveBeenCalledTimes(1);
  });

  it('rejeita quando o profissional não existe', async () => {
    const { bookingService } = buildService({
      professionalRepository: { findById: jest.fn().mockResolvedValue(null) },
    });

    await expect(
      bookingService.create({
        clientName: 'João', clientEmail: 'joao@x.com',
        startTime: futureDateWithinWindow, professionalId: 'inexistente', serviceId: 'serv-1',
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('rejeita quando o dia está bloqueado', async () => {
    const { bookingService } = buildService({
      blockedDateRepository: { existsForDate: jest.fn().mockResolvedValue(true) },
    });

    await expect(
      bookingService.create({
        clientName: 'João', clientEmail: 'joao@x.com',
        startTime: futureDateWithinWindow, professionalId: 'prof-1', serviceId: 'serv-1',
      }),
    ).rejects.toThrow(ConflictError);
  });

  it('rejeita quando fora do horário de funcionamento', async () => {
    const { bookingService } = buildService();

    await expect(
      bookingService.create({
        clientName: 'João', clientEmail: 'joao@x.com',
        startTime: '2026-08-17T23:00:00', professionalId: 'prof-1', serviceId: 'serv-1',
      }),
    ).rejects.toThrow(ConflictError);
  });

  it('rejeita quando startTime está no passado', async () => {
    const { bookingService } = buildService();

    await expect(
      bookingService.create({
        clientName: 'João', clientEmail: 'joao@x.com',
        startTime: '2020-01-01T09:00:00', professionalId: 'prof-1', serviceId: 'serv-1',
      }),
    ).rejects.toThrow(BadRequestError);
  });
});