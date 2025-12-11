import { Request, Response } from "express";
import { authService } from "./auth.service";

class AuthController {
    
    async register(req: Request, res: Response) {
        try {
            // O req.body já foi validado pelo Zod Middleware antes de chegar aqui
            const result = await authService.register(req.body);

            return res.status(201).json({
                message: "Cadastro realizado com sucesso!",
                user: {
                    id: result.user.id,
                    name: result.user.name,
                    email: result.user.email
                },
                redirect_to: result.type === 'admin' ? '/admin/dashboard' : '/app/dashboard'
            });

        } catch (error: any) {
            return res.status(400).json({
                message: error.message || "Erro ao realizar cadastro"
            });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const result = await authService.login(req.body);

            return res.status(200).json({
                message: "Login realizado com sucesso!",
                token: result.token,
                user: {
                    id: result.user.id,
                    name: result.user.name,
                    email: result.user.email,
                    tenant_id: result.user.tenant_id
                }
            });

        } catch (error: any) {
            // Retorna 401 (Unauthorized) para erro de credenciais
            return res.status(401).json({
                message: error.message || "Erro de autenticação"
            });
        }
    }

    async me(req: Request, res: Response) {
        return res.status(200).json({
            user: req.user
        });
    }

    async forgotPassword(req: Request, res: Response) {
        try {
            await authService.forgotPassword(req.body.email);
            // Sempre retorna 200, mesmo se o e-mail não existir (Segurança)
            return res.status(200).json({ 
                message: "Se o e-mail existir, você receberá um link de recuperação." 
            });
        } catch (error) {
            return res.status(500).json({ message: "Erro ao enviar e-mail" });
        }
    }

    async resetPassword(req: Request, res: Response) {
        try {
            await authService.resetPassword(req.body);
            return res.status(200).json({ message: "Senha alterada com sucesso!" });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

}

export const authController = new AuthController();