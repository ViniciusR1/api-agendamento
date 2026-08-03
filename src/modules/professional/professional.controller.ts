import {Request, Response} from 'express';
import {ProfessionalService} from './professional.service';

export class ProfessionalController {
  constructor(private readonly service: ProfessionalService ) {};

  list = async (req:Request, res:Response):Promise< void> => {
    const professionals = await this.service.list();
    res.status(200).json(professionals);
  };

  getById = async (req: Request, res:Response):Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const profissional = await this.service.getById(id);
    res.status(200).json(profissional);
  }
  create = async (req:Request, res:Response):Promise<void> => {
    const profissional = await this.service.create(req.body);
    res.status(201).json(profissional);
  }
}