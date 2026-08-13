import {Request, Response} from 'express';
import {BookingService} from './booking.service';

interface BookingIdParams {
  id: string;
}

export class BookingController {
  constructor(private readonly service: BookingService){}

  create = async (req:Request, res:Response): Promise<void> => {
    const booking = await this.service.create(req.body);
    res.status(201).json(booking);
  };

  cancel = async (req: Request<BookingIdParams>, res:Response): Promise<void> => {
    const booking = await this.service.cancel(req.params.id);
    res.status(200).json(booking);
  }
}