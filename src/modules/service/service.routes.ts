import {Router} from 'express';
import {ServiceController} from './service.controller';
import { asyncHandler } from '../../shared/middlewares/async-handler';

export function createServiceRouter(controller: ServiceController): Router {
  const router = Router();

  router.get('/', asyncHandler(controller.listByProfessional));
  router.get('/:id', asyncHandler(controller.getById));
  router.post('/', asyncHandler(controller.create));
  return router
}