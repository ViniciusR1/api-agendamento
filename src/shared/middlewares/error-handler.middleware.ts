import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/app-error';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction, 
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }
  console.error(err);

  const isProduction = process.env.NODE_ENV === 'production';
  res.status(500).json({ error: isProduction ? 'Erro interno no servidor' : err.message });
}