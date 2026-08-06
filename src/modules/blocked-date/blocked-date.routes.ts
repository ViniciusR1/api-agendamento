import {Router} from 'express';
import {BlockedDateController} from './blocked-date.controller';
import { asyncHandler } from '../../shared/middlewares/async-handler';

export function createBlockedDateRouter(controller: BlockedDateController): Router {
  const router = Router();

  router.get('/', asyncHandler(controller.listByProfessional));
  router.post('/', asyncHandler(controller.create));
  return router
}