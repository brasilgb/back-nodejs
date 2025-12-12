import { Router } from 'express';
import { ensureAuthenticated } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { budgetController } from './budget.controller';
import { createBudgetSchema, updateBudgetSchema } from './budget.schema';

const budgetRoutes = Router();

budgetRoutes.get('/', ensureAuthenticated, budgetController.list);
budgetRoutes.post('/', ensureAuthenticated, validate(createBudgetSchema), budgetController.create);
budgetRoutes.patch('/:id', ensureAuthenticated, validate(updateBudgetSchema), budgetController.update);
budgetRoutes.get('/:id', ensureAuthenticated, budgetController.listById);
budgetRoutes.delete('/:id', ensureAuthenticated, budgetController.delete);

export { budgetRoutes };