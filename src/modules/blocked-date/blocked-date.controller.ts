import {Request, Response} from 'express';
import {BlockedDateService} from './blocked-date.service';
import { BadRequestError } from '../../shared/errors/app-error';

export class BlockedDateController {
  constructor(private readonly service: BlockedDateService) {}

  create = async (req:Request, res:Response):Promise<void> => {
    const item = await this.service.create(req.body);
    res.status(201).json(item);
  }
  listByProfessional = async (req:Request, res:Response):Promise<void> => {
    const {professionalId} = req.query;
    if(typeof professionalId !== 'string') {
      throw new BadRequestError('O parâmetro professionalId é obrigatório');
    }
    const items = await this.service.listByProfessional(professionalId);
    res.status(200).json(items);
  }
}