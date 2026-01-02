import { ScheduleRepository } from "./schedule.repository";
import { CreateScheduleDTO, UpdateScheduleDTO } from "./schedule.schema";

const scheduleRepository = new ScheduleRepository();

export class ScheduleService {

    async list(tenantId: number) {
        return scheduleRepository.findAll(tenantId);
    }

    async listById(id: number, tenantId: number) {
        const schedule = await scheduleRepository.findById(id, tenantId);
        if (!schedule) throw new Error("Orçamento não encontrado.");
        return schedule;
    }

    async create(tenantId: number, data: CreateScheduleDTO) {
        return scheduleRepository.create(tenantId, data);
    }

    async update(id: number, tenantId: number, data: UpdateScheduleDTO) {
        const currentSchedule = await scheduleRepository.findById(id, tenantId);
        if (!currentSchedule) throw new Error("Orçamento não encontrado.");

        return scheduleRepository.update(id, tenantId, data);
    }

    async listSchedulesPaginated(params: FindAllPaginatedParams) {
        return scheduleRepository.findAllSchedulesPaginated(params)
    }

    async delete(id: number, tenantId: number) {
        const schedule = await scheduleRepository.findById(id, tenantId);
        if (!schedule) throw new Error("Orçamento não encontrado.");

        return scheduleRepository.delete(id);
    }
}