import {Router} from 'express';
import {ProfessionalController} from './professional.controller';
import { asyncHandler } from '../../shared/middlewares/async-handler';
import {validate} from '../../shared/middlewares/validate.middleware';
import { createProfessionalSchema } from './professional.validation';

export function createProfessionalRouter(controller: ProfessionalController): Router {
  
  const router = Router();

  router.get('/', asyncHandler(controller.list));
  router.get('/:id', asyncHandler(controller.getById));
  router.post('/', validate(createProfessionalSchema), asyncHandler(controller.create));
  return router
}