import { Request, Response } from "express";
import { ScheduleService } from "./schedule.service";
import { createScheduleSchema, updateScheduleSchema } from "./schedule.schema";
import moment from "moment";

const scheduleService = new ScheduleService();

class ScheduleController {

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

        const schedules = await scheduleService.listSchedulesPaginated({
            tenantId,
            page,
            pageSize,
            search,
            sortBy,
            sortDir,
        })

        return res.json(schedules)
    }

    async listById(req: Request, res: Response) {
        const tenantId = req.user?.tenant_id;
        const { id } = req.params;
        if (!tenantId) return res.status(403).json({ message: "Acesso negado" });

        try {
            const schedule = await scheduleService.listById(Number(id), tenantId);
            return res.json(schedule);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        const tenantId = req.user?.tenant_id;
        if (!tenantId) return res.status(403).json({ message: "Acesso negado" });

        try {
            const data = createScheduleSchema.parse(req.body);

            const schedule = await scheduleService.create(tenantId, data);
            return res.status(201).json(schedule);
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
            const data = updateScheduleSchema.parse(req.body);
            const schedule = await scheduleService.update(Number(id), tenantId, data);
            return res.json(schedule);
        } catch (error: any) {
            return res.status(400).json({ error: error.message || error });
        }
    }

    async delete(req: Request, res: Response) {
        const tenantId = req.user?.tenant_id;
        const { id } = req.params;
        if (!tenantId) return res.status(403).json({ message: "Acesso negado" });

        try {
            await scheduleService.delete(Number(id), tenantId);
            return res.status(200).json({ message: "Orçamento deletado com sucesso" });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export const scheduleController = new ScheduleController();