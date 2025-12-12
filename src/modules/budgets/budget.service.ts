import { BudgetRepository } from "./budget.repository";
import { CreateBudgetDTO, UpdateBudgetDTO } from "./budget.schema";

const budgetRepository = new BudgetRepository();

export class BudgetService {

    async list(tenantId: number) {
        return budgetRepository.findAll(tenantId);
    }

    async listById(id: number, tenantId: number) {
        const budget = await budgetRepository.findById(id, tenantId);
        if (!budget) throw new Error("Orçamento não encontrado.");
        return budget;
    }

    async create(tenantId: number, data: CreateBudgetDTO) {
        return budgetRepository.create(tenantId, data);
    }

    async update(id: number, tenantId: number, data: UpdateBudgetDTO) {
        const currentBudget = await budgetRepository.findById(id, tenantId);
        if (!currentBudget) throw new Error("Orçamento não encontrado.");

        return budgetRepository.update(id, tenantId, data);
    }

    async delete(id: number, tenantId: number) {
        const budget = await budgetRepository.findById(id, tenantId);
        if (!budget) throw new Error("Orçamento não encontrado.");

        return budgetRepository.delete(id);
    }
}