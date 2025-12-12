import { Router } from 'express';
import { ensureAuthenticated } from '../../middlewares/auth.middleware';
import { createCustomerSchema, updateCustomerSchema } from './customer.schema';
import { validate } from '../../middlewares/validate.middleware';
import { customerController } from './customer.controller';

const customerRoutes = Router();

customerRoutes.get('/', ensureAuthenticated, customerController.list);
customerRoutes.post('/', ensureAuthenticated, validate(createCustomerSchema), customerController.create);
customerRoutes.patch('/:id', ensureAuthenticated, validate(updateCustomerSchema), customerController.update);
customerRoutes.get('/:id', ensureAuthenticated, customerController.listById);
customerRoutes.delete('/:id', ensureAuthenticated, customerController.delete);

export { customerRoutes };