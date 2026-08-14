import request from 'supertest';
import { createApp } from '../../infra/http/app';
import { prisma } from '../../lib/prisma';

const app = createApp();

describe('E2E: GET /professionals/:id/available-slots', () => {
  let professionalId: string;
  let serviceId: string;

  beforeAll(async () => {
    const professional = await prisma.professional.create({
      data: { name: 'E2E Test', email: `e2e-${Date.now()}@test.com`, timezone: 'America/Recife' },
    });
    professionalId = professional.id;

    const service = await prisma.service.create({
      data: { name: 'Consulta', durationInMinutes: 30, price: 100, professionalId },
    });
    serviceId = service.id;

    await prisma.availability.create({
      data: { weekday: 'MONDAY', startTime: '09:00', endTime: '10:00', professionalId },
    });
  }, 15000);

  afterAll(async () => {
    if (professionalId) {
      await prisma.booking.deleteMany({ where: { professionalId } });
      await prisma.availability.deleteMany({ where: { professionalId } });
      await prisma.service.deleteMany({ where: { professionalId } });
      await prisma.professional.delete({ where: { id: professionalId } });
    }
    await prisma.$disconnect();
  });

  it('retorna 2 slots de 30min para uma segunda-feira dentro do expediente', async () => {
    const response = await request(app)
      .get(`/professionals/${professionalId}/available-slots`)
      .query({ serviceId, date: '2026-08-17' });

    expect(response.status).toBe(200);
    expect(response.body.slots).toHaveLength(2);
  }, 15000);

  it('retorna 400 quando a data está mal formatada', async () => {
    const response = await request(app)
      .get(`/professionals/${professionalId}/available-slots`)
      .query({ serviceId, date: '17-08-2026' });

    expect(response.status).toBe(400);
  }, 15000);

  it('retorna 404 quando o serviceId não existe', async () => {
    const response = await request(app)
      .get(`/professionals/${professionalId}/available-slots`)
      .query({ serviceId: 'id-invalido', date: '2026-08-17' });

    expect(response.status).toBe(404);
  }, 15000);
});