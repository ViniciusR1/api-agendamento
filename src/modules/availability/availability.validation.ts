import {z} from 'zod';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const createAvailabilitySchema = z.object({
  weekday: z.enum(
    ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'],
    {message: 'weekday deve ser um dia da semana válido'},
  ),
  startTime: z.string().regex(timeRegex, 'startTime deve estar no formato HH:mm'),
  endTime: z.string().regex(timeRegex, 'startTime deve estar no formato HH:mm'),
  professionalId: z.string().uuid('professionalId deve ser um uuid válido'),
})
.refine((data) => data.startTime < data.endTime, {
  message: 'startTime deve ser anterior a endTime',
  path: ['startTime'],
});

export type CreateAvailabilityInput = z.infer<typeof createAvailabilitySchema>;