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
import { orderRoutes } from './modules/orders/order.routes';
import { customerRoutes } from './modules/customers/customer.routes';
import { tenantRoutes } from './modules/tenants/tenant.routes';
import { userRoutes } from './modules/users/user.routes';

const router = Router();
router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/orders', orderRoutes);
router.use('/tenants', tenantRoutes);
router.use('/users', userRoutes);

export { router };