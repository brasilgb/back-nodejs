import { Router } from 'express';
import { ensureAuthenticated } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { scheduleController } from './schedule.controller';
import { createScheduleSchema, updateScheduleSchema } from './schedule.schema';

const scheduleRoutes = Router();

scheduleRoutes.get('/', ensureAuthenticated, scheduleController.list);
scheduleRoutes.post('/', ensureAuthenticated, validate(createScheduleSchema), scheduleController.create);
scheduleRoutes.patch('/:id', ensureAuthenticated, validate(updateScheduleSchema), scheduleController.update);
scheduleRoutes.get('/:id', ensureAuthenticated, scheduleController.listById);
scheduleRoutes.delete('/:id', ensureAuthenticated, scheduleController.delete);

export { scheduleRoutes };