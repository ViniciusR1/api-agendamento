import {z} from 'zod';

export const createServiceSchema = z.object({
  name: z.string().trim().min(1, 'nome do serviço é obrigatório'),
  durationInMinutes: z.number({message: 'duração deve ser um número'})
  .int('duração deve ser um número inteiro')
  .positive('duração deve ser maior que zero'),
  price: z.number({message: 'preço deve ser um número'})
  .nonnegative('preço não pode ser negativo'),
  professionalId: z.string().trim().uuid('professionalId deve ser um uuid válido'),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;