import { Request, Response } from 'express';
import { userService } from './user.service.js';

export const userController = {
    async list(req: Request, res: Response): Promise<Response> {

        try {
            const users = await userService.findAll();
            return res.status(200).json({ users });
        } catch (error) {
            return res.status(400).json({ message: 'Erro ao listar usuários' })
        }
    },

    async listById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const userId = Number(id);
            const user = await userService.findById(userId);
            return res.status(200).json({
                user: user
            })
        } catch (error) {
            return res.status(400).json({ message: "Erro ao listar usuário" });
        }
    },

    async create(req: Request, res: Response): Promise<Response> {
        // 1. Tenta pegar do token (Usuário Comum)
        let tenantId = req.user?.tenant_id;
        
        // Separa os dados do body
        const { retype_password, ...userData } = req.body;

        // 2. Se for null ou undefined (Significa que é ROOT/SUPERADMIN)
        if (!tenantId) {
            // Então obrigamos que venha no corpo da requisição
            tenantId = userData.tenant_id;

            // 3. Validação de Segurança: Se for Root mas não mandou o ID, bloqueia.
            if (!tenantId) {
                return res.status(400).json({ 
                    message: "Superusuários devem informar o tenant_id para cadastrar usuários." 
                });
            }
        }

        // Converte para garantir que é número
        const tenant = Number(tenantId);

        try {
            // Passamos o tenant ID decidido acima + os dados
            const newUser = await userService.create(tenant, userData);
            
            return res.status(201).json({ // 201 Created é melhor que 200
                message: "Usuário criado com sucesso!",
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    // Útil retornar o tenant_id para confirmar onde foi criado
                    tenant_id: newUser.tenant_id 
                }
            });
        } catch (error: any) {
            return res.status(400).json({ 
                message: error.message || "Erro ao criar usuário" 
            })
        }
    },

    async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { retype_password, ...userData } = req.body;

        try {
            const userId = Number(id);

            if (isNaN(userId)) {
                return res.status(400).json({
                    message: "ID Inválido"
                });
            }

            const updateUser = await userService.update(userId, userData);

            return res.status(200).json({
                message: "Usuário atualizado com sucesso!",
                user: updateUser
            });

        } catch (error: any) {
            return res.status(400).json({
                message: error.message || "Erro ao atualizar usuário"
            })
        }
    },

    async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const userId = Number(id);
            if (isNaN(userId)) {
                return res.status(400).json({
                    message: "ID Inválido"
                })
            }

            await userService.delete(userId);

            return res.status(200).json({
                message: "Usuário deletado com sucesso!"
            });

        } catch (error: any) {
            return res.status(400).json({
                message: error.message || "Erro ao deletar usuário"
            });
        }
    }

}