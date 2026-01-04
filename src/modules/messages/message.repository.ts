import { getNextSequence } from "../../utils/sequence";
import { prisma } from "../../lib/prisma";

export class MessageRepository {

    async findAllMessagesPaginated({
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
                where.OR.push({ message_number: searchNumber });
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
            prisma.message.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy,
                include: {
                    sender: {
                        select: { id: true, name: true }
                    },
                    recipient: {
                        select: { id: true, name: true }
                    }
                },
            }),
            prisma.message.count({ where }),
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
        return prisma.message.findMany({
            where: { tenant_id: tenantId },
            orderBy: { id: 'desc' }
        });
    }

    async findById(id: number, tenantId: number) {
        return prisma.message.findFirst({
            where: { id, tenant_id: tenantId }
        });
    }

    async create(tenantId: number, data: any) {

        // Gera número sequencial
        const nextNumber = await getNextSequence(prisma.message, tenantId, "message_number");

        return prisma.message.create({
            data: {
                tenant_id: tenantId,
                message_number: nextNumber,
                sender_id: data.sender_id,
                recipient_id: data.recipient_id,
                title: data.title,
                message: data.message,
                status: data.status
            },
        });
    }


    async update(id: number, tenantId: number, data: any) {
        // A lógica de recalcular o total fica no Service, aqui apenas salvamos
        return prisma.message.update({
            where: { id },
            data: data
        });
    }

    async delete(id: number) {
        return prisma.message.delete({ where: { id } });
    }
}