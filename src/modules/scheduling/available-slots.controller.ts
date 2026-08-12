// available-slots.controller.ts
import { Request, Response } from "express";
import { AvailableSlotsService } from "./available-slots.service";
import { BadRequestError } from "../../shared/errors/app-error";

interface AvailableSlotsParams {
  id: string;
}
export class AvailableSlotsController {
  constructor(private readonly service: AvailableSlotsService) {}

  getAvailableSlots = async (
    req: Request<AvailableSlotsParams>,
    res: Response,
  ): Promise<void> => {
    const { id: professionalId } = req.params;
    const { serviceId, date } = req.query;
    if (typeof serviceId !== "string" || typeof date !== "string") {
      throw new BadRequestError("serviceId and date query params are required");
    }
    if(!/^\d{4}-\d{2}$/.test(date)) {
      throw new BadRequestError('Data deve estar no formato AAAA-MM-DD')
    }
    const parsedDate = new Date(`${date}T00:00:00.000Z`);
    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestError("Data deve estar no formato AAAA-MM-DD");
    }
    const slots = await this.service.getAvailableSlots(
      professionalId,
      serviceId,
      date,
    );
    res.status(200).json({ date, slots });
  };
}
