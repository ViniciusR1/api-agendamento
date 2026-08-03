import express, {Express} from 'express';
import { buildContainer } from './container';
import { createProfessionalRouter } from '../../modules/professional/professional.routes';
import { errorHandler } from '../../shared/middlewares/error-handler.middleware';

export function createApp(): Express {
  const app = express();

  app.use(express.json());
  app.get('/health', (req, res) => {
    res.status(200).json({status: 'ok'});
  });

  const container = buildContainer();
  app.use('/professionals', createProfessionalRouter(container.professionalController));
  app.use(errorHandler);

  return app
}