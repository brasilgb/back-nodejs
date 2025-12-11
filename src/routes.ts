import { Router } from 'express';
import { userController } from './modules/users/user.controller';
import { validate } from './middlewares/validate.middleware';
import { createUserSchema, updateUserSchema } from './modules/users/user.schema';
import { tenantController } from './modules/tenants/tenant.controller';
import { createTenantSchema, updateTenantSchema } from './modules/tenants/tenant.schema';
import { authRoutes } from './modules/auth/auth.routes';
import { ensureAuthenticated } from './middlewares/auth.middleware';
import { customerController } from './modules/customers/customer.controller';
import { createCustomerSchema, updateCustomerSchema } from './modules/customers/customer.schema';

const router = Router();
router.use('/auth', authRoutes);

router.get('/customers', ensureAuthenticated, customerController.list);
router.post('/customers', ensureAuthenticated, validate(createCustomerSchema), customerController.create);
router.patch('/customers/:id', ensureAuthenticated, validate(updateCustomerSchema), customerController.update);
router.get('/customers/:id', ensureAuthenticated, customerController.listById);
router.delete('/customers/:id', ensureAuthenticated, customerController.delete);

// Tenants
router.get('/tenants', tenantController.list);
router.post('/tenants', validate(createTenantSchema), tenantController.create);
router.patch('/tenants/:id', validate(updateTenantSchema), tenantController.update);
router.get('/tenants/:id', tenantController.listById);
router.delete('/tenants/:id', tenantController.delete);

// Usuários
router.get('/users', ensureAuthenticated, userController.list);
router.post('/users', ensureAuthenticated, validate(createUserSchema), userController.create);
router.patch('/users/:id', validate(updateUserSchema), userController.update);
router.get('/users/:id', userController.listById);
router.delete('/users/:id', userController.delete);

export { router };