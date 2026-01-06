import { Router } from 'express';
import { ensureAuthenticated } from '../../middlewares/auth.middleware';
import { saleController } from './SaleController';


const saleRoutes = Router();

saleRoutes.post('/', ensureAuthenticated, saleController.handle);

export { saleRoutes };