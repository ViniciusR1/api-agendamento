import { prisma } from '../../lib/prisma';
import { PrismaBookingRepository } from './prisma-booking.repository';
import { ConflictError } from '../../shared/errors/app-error';

const bookingRepository = new PrismaBookingRepository(prisma);

describe('Concorrência na criação de Booking', () => {
  let professionalId: string;
  let serviceId: string;

  beforeAll(async () => {
    const professional = await prisma.professional.create({
      data: { name: 'Teste Concorrência', email: `concurrency-${Date.now()}@test.com`, timezone: 'America/Recife' },
    });
    professionalId = professional.id;

    const service = await prisma.service.create({
      data: { name: 'Consulta', durationInMinutes: 30, price: 100, professionalId },
    });
    serviceId = service.id;
  }, 15000); 

  afterAll(async () => {
    if (professionalId) {
      await prisma.booking.deleteMany({ where: { professionalId } });
      await prisma.service.deleteMany({ where: { professionalId } });
      await prisma.professional.delete({ where: { id: professionalId } });
    }
    await prisma.$disconnect();
  });

  it('permite apenas UM booking vencer quando 5 requisições concorrem pelo mesmo horário', async () => {
    const startTime = new Date('2026-09-01T12:00:00.000Z');
    const endTime = new Date('2026-09-01T12:30:00.000Z');

    const attempts = Array.from({ length: 5 }, (_, i) =>
      bookingRepository.create({
        clientName: `Cliente ${i}`,
        clientEmail: `cliente${i}@test.com`,
        startTime,
        endTime,
        professionalId,
        serviceId,
      }).then(
        (result) => ({ status: 'fulfilled' as const, result }),
        (error) => ({ status: 'rejected' as const, error }),
      ),
    );

    const results = await Promise.all(attempts);

    const successes = results.filter((r) => r.status === 'fulfilled');
    const conflicts = results.filter(
      (r) => r.status === 'rejected' && r.error instanceof ConflictError,
    );

    expect(successes).toHaveLength(1);
    expect(conflicts).toHaveLength(4);

    const bookingsInDb = await prisma.booking.findMany({
      where: { professionalId, startTime },
    });
    expect(bookingsInDb).toHaveLength(1);
  }, 15000); 
});