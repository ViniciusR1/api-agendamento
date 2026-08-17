import {z} from 'zod';

export const createBlockedDateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'data deve estar no formato AAAA-MM-DD'),
  reason:z.string().trim().min(1, 'motivo não pode estar vazio').optional(),
  professionalId:z.string().uuid('professionalId deve ser uma uuid válida'),
});

export type CreateBlockedDateInput = z.infer<typeof createBlockedDateSchema>