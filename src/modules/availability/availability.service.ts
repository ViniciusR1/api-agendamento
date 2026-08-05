import {AvailabilityRepository} from './availability.repository';
import {CreateAvailabilityDTO} from './availability.types';
import {BadRequestError} from '../../shared/errors/app-error';

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function windowsOverlap(
  aStart: string, aEnd: string,
  bStart: string, bEnd: string,
): boolean {
  return toMinutes(aStart) < toMinutes(bEnd) && toMinutes(bStart) < toMinutes(aEnd);
}

export class AvailabilityService {
  constructor(private readonly repository: AvailabilityRepository) {}

  async create(data: CreateAvailabilityDTO) {
    if (toMinutes(data.startTime) >= toMinutes(data.endTime)) {
      throw new BadRequestError('A hora de inicio deve ser anterior a hora de fim');
    }

    const existing = await this.repository.findByProfessionalAndWeekday(
      data.professionalId,
      data.weekday,
    );

    const hasConflict = existing.some((window) =>
      windowsOverlap(data.startTime, data.endTime, window.startTime, window.endTime),
    );

    if (hasConflict) {
      throw new BadRequestError('Janela de disponibilidade conflitante');
    }

    return this.repository.create(data);
  }

  async listByProfessionalAndWeekday(
    professionalId: string,
    weekday: CreateAvailabilityDTO['weekday'],
  ) {
    return this.repository.findByProfessionalAndWeekday(professionalId, weekday);
  }
}