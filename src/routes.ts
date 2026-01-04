import { Router } from 'express';
import { authRoutes } from './modules/auth/auth.routes';
import { orderRoutes } from './modules/orders/order.routes';
import { customerRoutes } from './modules/customers/customer.routes';
import { tenantRoutes } from './modules/tenants/tenant.routes';
import { userRoutes } from './modules/users/user.routes';
import { budgetRoutes } from './modules/budgets/budget.routes';
import { scheduleRoutes } from './modules/schedules/schedule.routes';
import { messageRoutes } from './modules/messages/message.routes';

const router = Router();
router.use('/tenants', tenantRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/customers', customerRoutes);
router.use('/orders', orderRoutes);
router.use('/budgets', budgetRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/messages', messageRoutes);

export { router };