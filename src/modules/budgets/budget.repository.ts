import { getNextSequence } from "../../utils/sequence";
import { prisma } from "../../lib/prisma";

export class BudgetRepository {

    async findAllBudgetsPaginated({
        tenantId,
        page,
        pageSize,
        search,
        sortBy = "created_at",
        sortDir = "desc",
    }: FindAllPaginatedParams) {
        const where = {
            tenant_id: tenantId,
            ...(search && {
                OR: [
                    { category: { contains: search } },
                    { service: { contains: search } },
                ],
            }),
        }
        const sortableFields = ["category", "created_at"]
        const orderBy = {
            [sortBy]: sortDir === "desc" ? "desc" : "asc",
        }

        if (!sortableFields.includes(sortBy)) {
            sortBy = "created_at"
        }
        const [data, total] = await Promise.all([
            prisma.budget.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy,
            }),
            prisma.budget.count({ where }),
        ])

        return {
            data,
            total,
            page,
            pageSize,
            pageCount: Math.ceil(total / pageSize),
        }
    }

    async findAll(tenantId: number) {
        return prisma.budget.findMany({
            where: { tenant_id: tenantId },
            orderBy: { id: 'desc' }
        });
    }

    async findById(id: number, tenantId: number) {
        return prisma.budget.findFirst({
            where: { id, tenant_id: tenantId }
        });
    }

    async create(tenantId: number, data: any) {
        // Gera número sequencial
        const nextNumber = await getNextSequence(prisma.budget, tenantId, "budget_number");

        return prisma.budget.create({
            data: {
                tenant_id: tenantId,
                budget_number: nextNumber,
                category: data.category,
                service: data.service,
                model: data.model,
                description: data.description,
                estimated_time: data.estimated_time,
                warranty: data.warranty,
                obs: data.obs,
                part_value: data.part_value,
                labor_value: data.labor_value,
                total_value: data.total_value,
            },
        });
    }


    async update(id: number, tenantId: number, data: any) {
        // A lógica de recalcular o total fica no Service, aqui apenas salvamos
        return prisma.budget.update({
            where: { id },
            data: data
        });
    }

    async delete(id: number) {
        return prisma.budget.delete({ where: { id } });
    }
}