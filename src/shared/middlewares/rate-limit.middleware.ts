import rateLimit from "express-rate-limit";

export const bookingRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  limit: 10, // no maximo 10 tentativas de agendamentos por ip por minuto
  message: {error: 'muitas tentativas de agendamento, tente novamente em instantes'},
  standardHeaders: true,
  legacyHeaders: false,
});

export const generalRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  limit: 100, // limite mais generoso para GET
  message: {error: 'muitas requisições, tente novamente em instantes'},
  standardHeaders: true,
  legacyHeaders: false,
});