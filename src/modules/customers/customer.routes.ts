import { Router } from 'express';
import { ensureAuthenticated } from '../../middlewares/auth.middleware';
import { createCustomerSchema, updateCustomerSchema } from './customer.schema';
import { validate } from '../../middlewares/validate.middleware';
import { customerController } from './customer.controller';

const customerRoutes = Router();

customerRoutes.get('/', customerController.list, ensureAuthenticated);
customerRoutes.post('/', validate(createCustomerSchema), customerController.create, ensureAuthenticated);
customerRoutes.patch('/:id', validate(updateCustomerSchema), customerController.update, ensureAuthenticated);
customerRoutes.get('/:id', customerController.listById, ensureAuthenticated);
customerRoutes.delete('/:id', customerController.delete, ensureAuthenticated);

export { customerRoutes };