import {Router} from 'express';
import {AvailabilityController} from './availability.controller';
import { asyncHandler } from '../../shared/middlewares/async-handler';

export function createAvailabilityRouter(controller: AvailabilityController): Router {
  const router = Router();

  router.get('/', asyncHandler(controller.listByProfessionalAndWeekday));
  router.post('/', asyncHandler(controller.create));
  return router
}