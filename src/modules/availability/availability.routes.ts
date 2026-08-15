import {Router} from 'express';
import {AvailabilityController} from './availability.controller';
import { asyncHandler } from '../../shared/middlewares/async-handler';
import {validate} from '../../shared/middlewares/validate.middleware';
import { createAvailabilitySchema } from './availability.validation';

export function createAvailabilityRouter(controller: AvailabilityController): Router {
  const router = Router();

  router.get('/', asyncHandler(controller.listByProfessionalAndWeekday));
  router.post('/', validate(createAvailabilitySchema), asyncHandler(controller.create));
  return router
}