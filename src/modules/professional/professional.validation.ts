import {z} from 'zod';

export const createProfessionalSchema = z.object({
  name: z.string().trim().min(1, 'nome é obrigatório'),
  email: z.string().trim().email('e-mail inválido'),
  timezone: z.string().trim().min(1, 'timezone não pode ser vazio').optional(),
})

export type CreateProfessionalInput = z.infer<typeof createProfessionalSchema>