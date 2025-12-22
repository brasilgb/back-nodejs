import { Request, Response } from "express";
import { OrderService } from "./order.service";
import { createOrderSchema, updateOrderSchema } from "./order.schema";

const orderService = new OrderService();

class OrderController {

    // 2. LISTAR (Todas as as ordens de servico)
    async list(req: Request, res: Response) {
        const tenantId = req.user?.tenant_id;
        if (!tenantId) {
            return res.status(403).json({ message: "Acesso negado" })
        };

        const page = Number(req.query.page ?? 1)
        const pageSize = Number(req.query.pageSize ?? 11)
        const search = String(req.query.search ?? "")
        const sortBy = req.query.sortBy as any
        const sortDir = req.query.sortDir as any

        const orders = await orderService.listOrderPaginated({
            tenantId,
            page,
            pageSize,
            search,
            sortBy,
            sortDir,
        });
        return res.json(orders);
    }

    // 3. EXIBIR (Buscar uma OS específica)
    async listById(req: Request, res: Response) {
        const tenantId = req.user?.tenant_id;
        const { id } = req.params;

        if (!tenantId) return res.status(403).json({ message: "Acesso negado" });

        try {
            // Converte string "123" para number 123
            const orderId = Number(id);
            if (isNaN(orderId)) return res.status(400).json({ message: "ID inválido" });

            const order = await orderService.findById(orderId, tenantId);
            return res.json(order);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    // 1. CRIAR
    async create(req: Request, res: Response) {
        const tenantId = req.user?.tenant_id;
        if (!tenantId) return res.status(403).json({ message: "Acesso negado" });

        try {
            // Valida os dados com Zod (Create Schema)
            const data = createOrderSchema.parse(req.body);

            const order = await orderService.create(tenantId, data);

            return res.status(201).json(order);
        } catch (error: any) {
            // Se for erro do Zod ou do Service, devolve 400
            return res.status(400).json({ error: error.message || error });
        }
    }

    // 4. ATUALIZAR
    async update(req: Request, res: Response) {
        const tenantId = req.user?.tenant_id;
        const { id } = req.params;

        if (!tenantId) return res.status(403).json({ message: "Acesso negado" });

        try {
            const orderId = Number(id);
            if (isNaN(orderId)) return res.status(400).json({ message: "ID inválido" });

            // Valida os dados com Zod (Update Schema - com técnico obrigatório)
            const data = updateOrderSchema.parse(req.body);

            const updatedOrder = await orderService.update(orderId, tenantId, data);
            return res.json(updatedOrder);
        } catch (error: any) {
            return res.status(400).json({ error: error.message || error });
        }
    }

    // 5. DELETAR
    async delete(req: Request, res: Response) {
        const tenantId = req.user?.tenant_id;
        const { id } = req.params;

        if (!tenantId) return res.status(403).json({ message: "Acesso negado" });

        try {
            const orderId = Number(id);
            if (isNaN(orderId)) return res.status(400).json({ message: "ID inválido" });

            await orderService.delete(orderId, tenantId);
            return res.status(200).json({ message: "Ordem de Serviço removida com sucesso." });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}
export const orderController = new OrderController();