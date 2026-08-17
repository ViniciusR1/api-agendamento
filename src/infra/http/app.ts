import express, { Express } from "express";
import { buildContainer } from "./container";
import { createProfessionalRouter } from "../../modules/professional/professional.routes";
import { errorHandler } from "../../shared/middlewares/error-handler.middleware";
import { createServiceRouter } from "../../modules/service/service.routes";
import { createAvailabilityRouter } from "../../modules/availability/availability.routes";
import { createBlockedDateRouter } from "../../modules/blocked-date/blocked-date.routes";
import { createAvailableSlotsRouter } from "../../modules/scheduling/available-slots.routes";
import { createBookingRouter } from "../../modules/booking/booking.routes";
import {generalRateLimiter} from '../../shared/middlewares/rate-limit.middleware';
import {bookingRateLimiter} from '../../shared/middlewares/rate-limit.middleware';
import helmet from 'helmet';

export function createApp(): Express {
  (helmet());
  const app = express();
  app.use(generalRateLimiter)

  app.use(express.json());
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  const container = buildContainer();
  app.use(
    "/professionals",
    createProfessionalRouter(container.professionalController),
  );
  app.use("/services", createServiceRouter(container.serviceController));
  app.use(
    "/availabilities",
    createAvailabilityRouter(container.availabilityController),
  );
  app.use(
    "/blocked-dates",
    createBlockedDateRouter(container.blockedDateController),
  );
  // "os slots disponíveis DAQUELE profissional" (GET /professionals/professinalId/available-slots?serviceId=serviceID&date= a data do dia)
  app.use(
    "/professionals",
    createAvailableSlotsRouter(container.availableSlotsController),
  );
  app.use('/bookings', createBookingRouter(container.bookingController));

  app.use(errorHandler);

  return app;
}
