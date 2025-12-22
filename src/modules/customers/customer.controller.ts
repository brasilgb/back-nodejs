import { Request, Response } from "express";
import { customerService } from "./customer.service";
import { ValidationError } from "../../errors/ValidationError";

class CustomerController {

    async list(req: Request, res: Response) {
        const tenantId = req.user?.tenant_id
        if (!tenantId) {
            return res.status(403).json({ message: "Acesso negado" })
        }

        const page = Number(req.query.page ?? 1)
        const pageSize = Number(req.query.pageSize ?? 11)
        const search = String(req.query.search ?? "")
        const sortBy = req.query.sortBy as any
        const sortDir = req.query.sortDir as any

        const customers = await customerService.listCustomersPaginated({
            tenantId,
            page,
            pageSize,
            search,
            sortBy,
            sortDir,
        })

        return res.json(customers)
    }



    async listById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const tenantId = req.user?.tenant_id;
        try {
            const customerId = Number(id);
            const tenantid = Number(tenantId);
            const customer = await customerService.findById(tenantid, customerId);
            return res.status(200).json({
                customer: customer
            })
        } catch (error) {
            return res.status(400).json({ message: "Erro ao listar tenant" })
        }
    }

    async create(req: Request, res: Response) {
        try {
            const tenantId = req.user?.tenant_id;
            if (!tenantId) return res.status(403).json({ message: "Acesso negado" });

            const newCustomer = await customerService.create(tenantId, req.body);
            return res.status(201).json(newCustomer);

        } catch (error: any) {
            if (error instanceof ValidationError) {
                return res.status(400).json({
                    message: error.message,
                    fieldErrors: error.fieldErrors,
                })
            }
            return res.status(400).json({ message: error.message || "Erro interno ao salvar cliente" });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const tenantId = req.user?.tenant_id;
            if (!tenantId) return res.status(403).json({ message: "Acesso negado" });

            const { id } = req.params;
            await customerService.update(tenantId, Number(id), req.body);

            return res.json({ message: "Cliente atualizado com sucesso" });

        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;
        const tenantId = req.user?.tenant_id;
        try {
            if (!tenantId) return res.status(403).json({ message: "Acesso negado" });

            const userId = Number(id);
            if (isNaN(userId)) {
                return res.status(400).json({
                    message: "ID Inválido"
                })
            }

            await customerService.delete(tenantId, userId);

            return res.status(200).json({
                message: "Cliente deletado com sucesso!"
            });

        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }
}

export const customerController = new CustomerController();