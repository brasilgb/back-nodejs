import { Router } from 'express';
import { ensureAuthenticated } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { productController } from './product.controller';
import { createProductSchema, updateProductSchema } from './product.schema';

const productRoutes = Router();

productRoutes.get('/', ensureAuthenticated, productController.list);
productRoutes.post('/', ensureAuthenticated, validate(createProductSchema), productController.create);
productRoutes.patch('/:id', ensureAuthenticated, validate(updateProductSchema), productController.update);
productRoutes.get('/:id', ensureAuthenticated, productController.listById);
productRoutes.delete('/:id', ensureAuthenticated, productController.delete);

export { productRoutes };