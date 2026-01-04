import { Router } from 'express';
import { ensureAuthenticated } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { messageController } from './message.controller';
import { createMessageSchema, updateMessageSchema } from './message.schema';

const messageRoutes = Router();

messageRoutes.get('/', ensureAuthenticated, messageController.list);
messageRoutes.post('/', ensureAuthenticated, validate(createMessageSchema), messageController.create);
messageRoutes.patch('/:id', ensureAuthenticated, validate(updateMessageSchema), messageController.update);
messageRoutes.get('/:id', ensureAuthenticated, messageController.listById);
messageRoutes.delete('/:id', ensureAuthenticated, messageController.delete);

export { messageRoutes };