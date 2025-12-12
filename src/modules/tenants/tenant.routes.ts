import { Router } from 'express';
import { ensureAuthenticated } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { tenantController } from './tenant.controller';
import { createTenantSchema, updateTenantSchema } from './tenant.schema';

const tenantRoutes = Router();

tenantRoutes.get('/', tenantController.list);
tenantRoutes.post('/', validate(createTenantSchema), tenantController.create);
tenantRoutes.patch('/:id', validate(updateTenantSchema), tenantController.update);
tenantRoutes.get('/:id', tenantController.listById);
tenantRoutes.delete('/:id', tenantController.delete);

export { tenantRoutes };