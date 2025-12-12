import { Router } from 'express';
import { ensureAuthenticated } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { userController } from './user.controller';
import { createUserSchema, updateUserSchema } from './user.schema';

const userRoutes = Router();

userRoutes.get('/', ensureAuthenticated, userController.list);
userRoutes.post('/', ensureAuthenticated, validate(createUserSchema), userController.create);
userRoutes.patch('/:id', ensureAuthenticated, validate(updateUserSchema), userController.update);
userRoutes.get('/:id', ensureAuthenticated, userController.listById);
userRoutes.delete('/:id', ensureAuthenticated, userController.delete);

export { userRoutes };