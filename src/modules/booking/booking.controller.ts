import {Request, Response} from 'express';
import {BookingService} from './booking.service';

export class BookingController {
  constructor(private readonly service: BookingService){}

  create = async (req:Request, res:Response): Promise<void> => {
    const booking = await this.service.create(req.body);
    res.status(201).json(booking);
  };
}