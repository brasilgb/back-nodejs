import { prisma } from "../../lib/prisma";
import { getNextSequence } from "../../utils/sequence"; // Seu utilitário
class CustomerRepository {

    async findAllCustomersPaginated({
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
                    { name: { contains: search } },
                    { cpf: { contains: search } },
                ],
            }),
        }
        const sortableFields = ["name", "cpf", "created_at"]
        const orderBy = {
            [sortBy]: sortDir === "desc" ? "desc" : "asc",
        }

        if (!sortableFields.includes(sortBy)) {
            sortBy = "created_at"
        }
        const [data, total] = await Promise.all([
            prisma.customer.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy,
            }),
            prisma.customer.count({ where }),
        ])

        return {
            data,
            total,
            page,
            pageSize,
            pageCount: Math.ceil(total / pageSize),
        }
    }

    async findById(id: number, tenantId: number) {
        return prisma.customer.findFirst({
            where: { id: id, tenant_id: tenantId }
        });
    }

    // Busca por CPF/CNPJ dentro do tenant para evitar duplicidade
    async findByCpf(cpf: string, tenantId: number) {
        return prisma.customer.findFirst({
            where: {
                cpf: cpf,
                tenant_id: tenantId
            }
        });
    }

    // Busca por E-mail dentro do tenant para evitar duplicidade
    async findByEmail(email: string, tenantId: number) {
        return prisma.customer.findFirst({
            where: {
                email: email,
                tenant_id: tenantId,
            },
        });
    }

    async create(tenantId: number, data: any) {
        return prisma.$transaction(async (tx) => {

            const nextCode = await getNextSequence(tx.customer, tenantId, 'customer_number');
            const birthData = data.birth ? new Date(data.birth) : null;
            const addressNumber = data.number ? data.number : null;

            // 2. Cria o cliente
            return tx.customer.create({
                data: {
                    ...data,
                    tenant_id: tenantId,
                    customer_number: nextCode,
                    birth: birthData,
                    number: addressNumber
                }
            });
        });
    }

    async update(id: number, tenantId: number, data: any) {
        const birthData = data.birth ? new Date(data.birth) : null;
        const addressNumber = data.number ? data.number : null;
        return prisma.customer.updateMany({
            where: { id: id, tenant_id: tenantId },
            data: {
                ...data,
                birth: birthData,
                number: addressNumber
            }
        });
    }

    async delete(id: number, tenantId: number) {
        return prisma.customer.deleteMany({
            where: { id: id, tenant_id: tenantId }
        });
    }
}

export const customerRepository = new CustomerRepository();