import {Router} from 'express';
import {ProfessionalController} from './professional.controller';
import { asyncHandler } from '../../shared/middlewares/async-handler';

export function createProfessionalRouter(controller: ProfessionalController): Router {
  
  const router = Router();

  router.get('/', asyncHandler(controller.list));
  router.get('/:id', asyncHandler(controller.getById));
  router.post('/', asyncHandler(controller.create));
  return router
}