import { generateSlotsForWindow, removeConflictingSlots } from './slot-generator';

describe('generateSlotsForWindow', () => {
  it('gera slots corretamente dentro de uma janela de 3 horas com duração de 30min', () => {
    const slots = generateSlotsForWindow(
      '2026-08-17',
      { startTime: '09:00', endTime: '12:00' },
      30,
      'America/Recife',
    );

    expect(slots).toHaveLength(6);
    expect(slots[0].startTime.toISOString()).toBe('2026-08-17T12:00:00.000Z'); // 09h Recife = 12h UTC
    expect(slots[0].endTime.toISOString()).toBe('2026-08-17T12:30:00.000Z');
    expect(slots[5].endTime.toISOString()).toBe('2026-08-17T15:00:00.000Z'); // 12h Recife = 15h UTC
  });

  it('não gera slot parcial quando a duração não cabe exatamente na janela', () => {
    const slots = generateSlotsForWindow(
      '2026-08-17',
      { startTime: '09:00', endTime: '10:15' },
      30,
      'America/Recife',
    );

    // 09:00-09:30, 09:30-10:00 cabem; 10:00-10:30 estouraria os 10:15 -> só 2 slots
    expect(slots).toHaveLength(2);
  });

  it('respeita fusos horários diferentes gerando offsets UTC diferentes', () => {
    const recifeSlots = generateSlotsForWindow(
      '2026-08-17',
      { startTime: '09:00', endTime: '09:30' },
      30,
      'America/Recife',
    );
    const nySlots = generateSlotsForWindow(
      '2026-08-17',
      { startTime: '09:00', endTime: '09:30' },
      30,
      'America/New_York',
    );

    expect(recifeSlots[0].startTime.toISOString()).not.toBe(nySlots[0].startTime.toISOString());
  });
});

describe('removeConflictingSlots', () => {
  it('remove um slot que colide totalmente com um horário ocupado', () => {
    const slots = [
      { startTime: new Date('2026-08-17T12:00:00.000Z'), endTime: new Date('2026-08-17T12:30:00.000Z') },
      { startTime: new Date('2026-08-17T12:30:00.000Z'), endTime: new Date('2026-08-17T13:00:00.000Z') },
    ];
    const occupied = [
      { startTime: new Date('2026-08-17T12:00:00.000Z'), endTime: new Date('2026-08-17T12:30:00.000Z') },
    ];

    const result = removeConflictingSlots(slots, occupied);

    expect(result).toHaveLength(1);
    expect(result[0].startTime.toISOString()).toBe('2026-08-17T12:30:00.000Z');
  });

  it('remove um slot que colide parcialmente (overlap, não exato)', () => {
    const slots = [
      { startTime: new Date('2026-08-17T12:00:00.000Z'), endTime: new Date('2026-08-17T12:30:00.000Z') },
    ];
    const occupied = [
      { startTime: new Date('2026-08-17T12:15:00.000Z'), endTime: new Date('2026-08-17T12:45:00.000Z') },
    ];

    const result = removeConflictingSlots(slots, occupied);

    expect(result).toHaveLength(0);
  });

  it('mantém slots que não têm nenhuma sobreposição', () => {
    const slots = [
      { startTime: new Date('2026-08-17T12:00:00.000Z'), endTime: new Date('2026-08-17T12:30:00.000Z') },
    ];
    const occupied = [
      { startTime: new Date('2026-08-17T13:00:00.000Z'), endTime: new Date('2026-08-17T13:30:00.000Z') },
    ];

    const result = removeConflictingSlots(slots, occupied);

    expect(result).toHaveLength(1);
  });
});