import { Request, Response } from "express";
import { tenantService } from "./tenant.service";

export const tenantController = {
    async list(req: Request, res: Response): Promise<Response> {
        try {
            const tenants = await tenantService.findAll();
            return res.status(200).json({ tenants })
        } catch (error) {
            return res.status(400).json({ message: "Erro ao listar tenants" })
        }
    },

    async listById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const tenantId = Number(id);
            const tenant = await tenantService.findById(tenantId);
            return res.status(200).json({
                tenant: tenant
            })
        } catch (error) {
            return res.status(400).json({ message: "Erro ao listar tenant" })
        }
    },

    async create(req: Request, res: Response): Promise<Response> {
        const tenantData = req.body;

        try {
            const newTenant = await tenantService.create(tenantData);
            return res.status(200).json({
                message: "Tenant criado com sucesso!",
                tenant: newTenant
            });
        } catch (error: any) {
            return res.status(400).json({ message: error.message || "Erro ao criar tenant" })
        }
    },

    async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const data = req.body;

        try {
            const tenantId = Number(id);

            if (isNaN(tenantId)) {
                return res.status(400).json({
                    message: "ID Inválido"
                });
            }

            const updateTenant = await tenantService.update(tenantId, data);

            return res.status(200).json({
                message: "Tenant atualizado com sucesso!",
                tenant: updateTenant
            });

        } catch (error: any) {
            return res.status(400).json({
                message: error.message || "Erro ao atualizar tenant"
            })
        }
    },

    async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const tenantId = Number(id);
            if (isNaN(tenantId)) {
                return res.status(400).json({
                    message: "ID Inválido"
                })
            }

            await tenantService.delete(tenantId);

            return res.status(200).json({
                message: "Tenant deletado com sucesso!"
            });

        } catch (error: any) {
            return res.status(400).json({
                message: error.message || "Erro ao deletar tenant"
            });
        }
    }
}