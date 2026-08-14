import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';
import { BadRequestError } from '../errors/app-error';


export function validate(schema: ZodType) {
  return (req:Request, res:Response, next:NextFunction): void => {
    const result = schema.safeParse(req.body);

    if(!result.success) {
      const message = result.error.issues
      .map((issue) => issue.message)
      .join('; ');
      throw new BadRequestError(message);
    }
    req.body = result.data
    next()
  }
}