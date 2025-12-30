import { Request, Response } from "express";
import { BudgetService } from "./budget.service";
import { createBudgetSchema, updateBudgetSchema } from "./budget.schema";

const budgetService = new BudgetService();

class BudgetController {

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

        const budgets = await budgetService.listBudgetsPaginated({
            tenantId,
            page,
            pageSize,
            search,
            sortBy,
            sortDir,
        })

        return res.json(budgets)
    }

    async listById(req: Request, res: Response) {
        const tenantId = req.user?.tenant_id;
        const { id } = req.params;
        if (!tenantId) return res.status(403).json({ message: "Acesso negado" });

        try {
            const budget = await budgetService.listById(Number(id), tenantId);
            return res.json(budget);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        const tenantId = req.user?.tenant_id;
        if (!tenantId) return res.status(403).json({ message: "Acesso negado" });

        try {
            const data = createBudgetSchema.parse(req.body);
            const budget = await budgetService.create(tenantId, data);
            return res.status(201).json(budget);
        } catch (error: any) {
            return res.status(400).json({ error: error.message || error });
        }
    }

    async update(req: Request, res: Response) {
        const tenantId = req.user?.tenant_id;
        const { id } = req.params;
        if (!tenantId) return res.status(403).json({ message: "Acesso negado" });

        try {
            const data = updateBudgetSchema.parse(req.body);
            const budget = await budgetService.update(Number(id), tenantId, data);
            return res.json(budget);
        } catch (error: any) {
            return res.status(400).json({ error: error.message || error });
        }
    }

    async delete(req: Request, res: Response) {
        const tenantId = req.user?.tenant_id;
        const { id } = req.params;
        if (!tenantId) return res.status(403).json({ message: "Acesso negado" });

        try {
            await budgetService.delete(Number(id), tenantId);
            return res.status(200).json({ message: "Orçamento deletado com sucesso" });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export const budgetController = new BudgetController();