import {Router} from 'express';
import {BlockedDateController} from './blocked-date.controller';
import { asyncHandler } from '../../shared/middlewares/async-handler';
import {validate} from '../../shared/middlewares/validate.middleware';
import { createBlockedDateSchema } from './blocked-date.validation';

export function createBlockedDateRouter(controller: BlockedDateController): Router {
  const router = Router();

  router.get('/', asyncHandler(controller.listByProfessional));
  router.post('/', validate(createBlockedDateSchema), asyncHandler(controller.create));
  return router
}