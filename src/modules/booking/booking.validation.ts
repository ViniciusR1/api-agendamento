import {z} from 'zod';

export const createBookingSchema = z.object({
  clientName: z.string().trim().min(1, 'Nome do cliente é obrigatório'),
  clientEmail: z.string().trim().email('e-mail do cliente inválido'),
  startTime: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, 'startTime deve estar no formato YYYY-MM-DDTHH:mm:ss, sem fuso horário'),
  professionalId: z.string().uuid('professionalId deve ser um uuid válido'),
  serviceId: z.string().uuid('serviceId deve ser um uuid válido'),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>; 