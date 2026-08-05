import {Request, Response} from 'express';
import {AvailabilityService} from './availability.service';
import { CreateAvailabilityDTO } from './availability.types';
import { BadRequestError } from './../../shared/errors/app-error';

export class AvailabilityController {
  constructor(private readonly service: AvailabilityService) {}
  
  create = async(req:Request, res:Response):Promise<void> => {
    const item = await this.service.create(req.body);
    res.status(201).json(item);
  }
  listByProfessionalAndWeekday = async(req:Request, res:Response):Promise<void> => {
    const {professionalId, weekday} = req.query;
    if(typeof professionalId !== 'string' || typeof weekday !== 'string') {
      throw new BadRequestError('Os parâmetros professionalId e weekday é obrigatório');
    }
  const items = await this.service.listByProfessionalAndWeekday(professionalId, weekday as CreateAvailabilityDTO['weekday']);
  res.status(200).json(items);
  }
}