import { getNextSequence } from "../../utils/sequence";
import { prisma } from "../../lib/prisma";

export class ScheduleRepository {

    async findAllSchedulesPaginated({
        tenantId,
        page,
        pageSize,
        search,
        sortBy = "created_at",
        sortDir = "desc",
    }: FindAllPaginatedParams) {
        const where: any = {
            tenant_id: tenantId,
        }

        if (search) {
            const searchNumber = Number(search);
            where.OR = [
                { customers: { name: { contains: search } } },
                { customers: { cpf: { contains: search } } },
            ];

            if (!isNaN(searchNumber)) {
                where.OR.push({ schedule_number: searchNumber });
            }
        }

        const sortableFields = ["name", "cpf", "created_at"]
        let orderBy: any = {
            [sortBy]: sortDir === "desc" ? "desc" : "asc",
        }

        if (sortBy === 'name' || sortBy === 'cpf') {
            orderBy = {
                customers: {
                    [sortBy]: sortDir === "desc" ? "desc" : "asc",
                }
            }
        }

        if (!sortableFields.includes(sortBy)) {
            orderBy = { created_at: "desc" }
        }
        const [data, total] = await Promise.all([
            prisma.schedule.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy,
                include: {
                    customers: {
                        select: { id: true, name: true, phone: true }
                    },
                    users: {
                        select: { id: true, name: true}
                    }
                },
            }),
            prisma.schedule.count({ where }),
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
        return prisma.schedule.findMany({
            where: { tenant_id: tenantId },
            orderBy: { id: 'desc' }
        });
    }

    async findById(id: number, tenantId: number) {
        return prisma.schedule.findFirst({
            where: { id, tenant_id: tenantId }
        });
    }

    async create(tenantId: number, data: any) {
        // Gera número sequencial
        const nextNumber = await getNextSequence(prisma.schedule, tenantId, "schedules_number");

        return prisma.schedule.create({
            data: {
                tenant_id: tenantId,
                schedules_number: nextNumber,
                user_id: data.user_id,
                schedules: data.schedules,
                service: data.service,
                details: data.details,
                status: data.status,
                observations: data.observations,
            },
        });
    }


    async update(id: number, tenantId: number, data: any) {
        // A lógica de recalcular o total fica no Service, aqui apenas salvamos
        return prisma.schedule.update({
            where: { id },
            data: data
        });
    }

    async delete(id: number) {
        return prisma.schedule.delete({ where: { id } });
    }
}