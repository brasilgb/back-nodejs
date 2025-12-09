import { Router } from 'express';
import { userController } from './modules/users/user.controller';

const router = Router();

router.get('/users', userController.list);
router.post('/users', userController.create);

export { router };