import { getNextSequence } from "../../utils/sequence";
import { prisma } from "../../lib/prisma";

export class ProductRepository {

    async findAllProductsPaginated({
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
                    { part_number: { contains: search } },
                ],
            }),
        }
        const sortableFields = ["category", "part_number", "created_at"]
        const orderBy = {
            [sortBy]: sortDir === "desc" ? "desc" : "asc",
        }

        if (!sortableFields.includes(sortBy)) {
            sortBy = "created_at"
        }
        const [data, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy,
            }),
            prisma.product.count({ where }),
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
        return prisma.product.findMany({
            where: { tenant_id: tenantId },
            orderBy: { id: 'desc' }
        });
    }

    async findById(id: number, tenantId: number) {
        return prisma.product.findFirst({
            where: { id, tenant_id: tenantId }
        });
    }

    async create(tenantId: number, data: any) {
        // Gera número sequencial
        const nextNumber = await getNextSequence(prisma.product, tenantId, "product_number");

        return prisma.product.create({
            data: {
                tenant_id: tenantId,
                product_number: nextNumber,
                part_number: data.part_number,
                category: data.category,
                name: data.name,
                description: data.description,
                manufacturer: data.manufacturer,
                model_compatibility: data.model_compatibility,
                cost_price: data.cost_price,
                sale_price: data.sale_price,
                quantity: data.quantity,
                minimum_stock_level: data.minimum_stock_level,
                location: data.location,
                status: data.status
            },
        });
    }


    async update(id: number, tenantId: number, data: any) {
        // A lógica de recalcular o total fica no Service, aqui apenas salvamos
        return prisma.product.update({
            where: { id },
            data: data
        });
    }

    async delete(id: number) {
        return prisma.product.delete({ where: { id } });
    }
}