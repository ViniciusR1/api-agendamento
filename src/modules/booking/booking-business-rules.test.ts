import { isWithinAnyWindow } from './booking-business-rules';

describe('isWithinAnyWindow', () => {
  const windows = [{ startTime: '09:00', endTime: '12:00', weekday: 'MONDAY' as const, id: '1', professionalId: 'p1' }];

  it('aceita um booking totalmente dentro da janela', () => {
    const result = isWithinAnyWindow(
      new Date('2026-08-17T12:00:00.000Z'), // 09h Recife
      new Date('2026-08-17T12:30:00.000Z'), // 09h30 Recife
      windows,
      'America/Recife',
    );
    expect(result).toBe(true);
  });

  it('rejeita um booking que começa dentro mas termina depois do expediente', () => {
    const result = isWithinAnyWindow(
      new Date('2026-08-17T14:45:00.000Z'), // 11h45 Recife
      new Date('2026-08-17T15:45:00.000Z'), // 12h45 Recife, estoura os 12h
      windows,
      'America/Recife',
    );
    expect(result).toBe(false);
  });

  it('rejeita um booking totalmente fora de qualquer janela', () => {
    const result = isWithinAnyWindow(
      new Date('2026-08-17T23:00:00.000Z'),
      new Date('2026-08-17T23:30:00.000Z'),
      windows,
      'America/Recife',
    );
    expect(result).toBe(false);
  });
});