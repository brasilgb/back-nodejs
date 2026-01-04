import { Request, Response } from "express";
import { MessageService } from "./message.service";
import { createMessageSchema, updateMessageSchema } from "./message.schema";

const messageService = new MessageService();

class MessageController {

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

        const messages = await messageService.listMessagesPaginated({
            tenantId,
            page,
            pageSize,
            search,
            sortBy,
            sortDir,
        })

        return res.json(messages)
    }

    async listById(req: Request, res: Response) {
        const tenantId = req.user?.tenant_id;
        const { id } = req.params;
        if (!tenantId) return res.status(403).json({ message: "Acesso negado" });

        try {
            const message = await messageService.listById(Number(id), tenantId);
            return res.json(message);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        const tenantId = req.user?.tenant_id;
        if (!tenantId) return res.status(403).json({ message: "Acesso negado" });

        try {
            const data = createMessageSchema.parse(req.body);

            const message = await messageService.create(tenantId, data);
            return res.status(201).json(message);
        } catch (error: any) {
            console.log(error);
            
            return res.status(400).json({ error: error.message || error });
        }
    }

    async update(req: Request, res: Response) {
        const tenantId = req.user?.tenant_id;
        const { id } = req.params;
        if (!tenantId) return res.status(403).json({ message: "Acesso negado" });

        try {
            const data = updateMessageSchema.parse(req.body);
            const message = await messageService.update(Number(id), tenantId, data);
            return res.json(message);
        } catch (error: any) {
            return res.status(400).json({ error: error.message || error });
        }
    }

    async delete(req: Request, res: Response) {
        const tenantId = req.user?.tenant_id;
        const { id } = req.params;
        if (!tenantId) return res.status(403).json({ message: "Acesso negado" });

        try {
            await messageService.delete(Number(id), tenantId);
            return res.status(200).json({ message: "Orçamento deletado com sucesso" });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export const messageController = new MessageController();