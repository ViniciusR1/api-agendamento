import {Router} from 'express';
import {ServiceController} from './service.controller';
import { asyncHandler } from '../../shared/middlewares/async-handler';
import {validate} from '../../shared/middlewares/validate.middleware';
import { createServiceSchema } from './service.validation';


export function createServiceRouter(controller: ServiceController): Router {
  const router = Router();

  router.get('/', asyncHandler(controller.listByProfessional));
  router.get('/:id', asyncHandler(controller.getById));
  router.post('/', validate(createServiceSchema),asyncHandler(controller.create));
  return router
}