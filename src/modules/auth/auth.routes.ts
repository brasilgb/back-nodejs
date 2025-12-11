import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from './auth.schema';
import { ensureAuthenticated } from '../../middlewares/auth.middleware';

const authRoutes = Router();

// Rota de Registro
// POST /auth/register
authRoutes.post('/register', validate(registerSchema), authController.register);
authRoutes.post('/login', validate(loginSchema), authController.login);
authRoutes.get('/me', ensureAuthenticated, authController.me);

// Rota para pedir o e-mail
authRoutes.post('/forgot-password', 
    validate(forgotPasswordSchema), 
    authController.forgotPassword
);

// Rota para enviar a nova senha e o token
authRoutes.post('/reset-password', 
    validate(resetPasswordSchema), 
    authController.resetPassword
);
// authRoutes.post('/forgot-password', ...);

export { authRoutes };