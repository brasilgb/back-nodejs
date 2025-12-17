import { prisma } from "../../lib/prisma";
import { getNextSequence } from "../../utils/sequence"; // Seu utilitário
class CustomerRepository {

    async findAllPaginated({
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
            where.OR = [
                { name: { contains: search } },
                { cpf: { contains: search } },
            ]
        }

        const [items, total] = await prisma.$transaction([
            prisma.customer.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: {
                    [sortBy]: sortDir,
                },
            }),
            prisma.customer.count({ where }),
        ])

        return { items, total }
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