import { Router } from 'express';
import { ensureAuthenticated } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { orderController } from './order.controller';
import { createOrderSchema, updateOrderSchema } from './order.schema';

const orderRoutes = Router();

orderRoutes.get('/', ensureAuthenticated, orderController.list);
orderRoutes.post('/', ensureAuthenticated, validate(createOrderSchema), orderController.create);
orderRoutes.patch('/:id', ensureAuthenticated, validate(updateOrderSchema), orderController.update);
orderRoutes.get('/:id', ensureAuthenticated, orderController.listById);
orderRoutes.delete('/:id', ensureAuthenticated, orderController.delete);

export { orderRoutes };