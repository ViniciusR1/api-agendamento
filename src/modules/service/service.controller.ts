import {Request, Response} from 'express';
import {ServiceService} from './service.service';

export class ServiceController {
  constructor(private readonly service: ServiceService) {}

  getById = async (req:Request, res:Response):Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const item = await this.service.getById(id);
    res.status(200).json(item)
  }
  listByProfessional = async (req:Request, res:Response): Promise<void> => {
    const{professionalId} = req.query;
    if(typeof professionalId !== 'string') {
      res.status(400).json({error: 'O parâmentro professionalId é obrigatório'});
      return;
    }
    const items = await this.service.listByProfessional(professionalId);
    res.status(200).json(items);
  }
  create = async (req:Request, res:Response):Promise<void> => {
    const item = await this.service.create(req.body);
    res.status(201).json(item);
  }
}