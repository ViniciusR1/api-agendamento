import {Router} from 'express';
import { BookingController } from './booking.controller';
import { asyncHandler } from '../../shared/middlewares/async-handler';

export function createBookingRouter(controller: BookingController):Router {
  const router = Router();
  router.post('/', asyncHandler(controller.create));
  router.patch('/:id/cancel', asyncHandler((req, res) => controller.cancel(req as any, res)));
  return router;
}