import { CreateOrderDTO, UpdateOrderDTO } from "./order.schema";
import { getNextSequence } from "../../utils/sequence"; // Certifique-se que o caminho está certo
import { prisma } from "../../lib/prisma";

export class OrderRepository {
    
    // 1. CREATE: Gera número sequencial e salva
    async create(tenantId: number, data: any) {
        // Gera o próximo número de OS para este tenant (ex: 101, 102...)
        const nextOrderNumber = await getNextSequence(prisma.order, tenantId, "order_number");

        return prisma.order.create({
            data: {
                tenant_id: tenantId,
                order_number: nextOrderNumber,
                
                // Relacionamentos
                customer_id: data.customer_id,
                equipment_id: data.equipment_id,

                // Dados do Aparelho
                model: data.model,
                password: data.password,
                defect: data.defect,
                state_conservation: data.state_conservation,
                accessories: data.accessories,
                observations: data.observations,

                // Financeiro
                budget_value: data.budget_value,
                service_value: data.service_value,
                parts_value: data.parts_value,

                // Status e Prazos
                service_status: data.service_status,
                delivery_forecast: data.delivery_forecast,
                
                // Técnico (opcional no create)
                responsible_technician: data.responsible_technician,
            },
        });
    }

    // 2. FIND ALL: Lista todas as OS do tenant
    async findAllOrdersPaginated({
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
                where.OR.push({ order_number: searchNumber });
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
            prisma.order.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy,
                include: {
                    customers: {
                        select: { id: true, name: true, phone: true }
                    },
                    equipment: {
                        select: { id: true, equipment: true }
                    }
                },
            }),
            prisma.order.count({ where }),
        ])

        return {
            data,
            total,
            page,
            pageSize,
            pageCount: Math.ceil(total / pageSize),
        }
    }

    // 3. FIND BY ID: Busca uma OS específica (com segurança de tenant)
    async findById(id: number, tenantId: number) {
        return prisma.order.findFirst({
            where: {
                id: id,
                tenant_id: tenantId, // Garante que a OS pertence à empresa logada
            },
            include: {
                customers: true, // Traz tudo do cliente
                equipment: true, // Traz tudo do equipamento
                // Se tiver tabela de imagens ou peças, inclua aqui depois
            },
        });
    }

    // 4. UPDATE: Atualiza os dados
    async update(id: number, tenantId: number, data: any) {
        return prisma.order.update({
            where: {
                id: id,
                // Nota: O update do Prisma exige ID único no where. 
                // A segurança do tenantId deve ser feita no Service (verificando se existe antes) 
                // ou usando updateMany (mas updateMany não retorna o objeto alterado).
                // Vamos assumir que o Service já validou o tenantId no findById.
            },
            data: {
                // Campos permitidos na edição
                equipment_id: data.equipment_id,
                model: data.model,
                password: data.password,
                defect: data.defect,
                state_conservation: data.state_conservation,
                accessories: data.accessories,
                observations: data.observations,
                
                // Financeiro e Status
                budget_value: data.budget_value,
                service_value: data.service_value,
                parts_value: data.parts_value,
                service_cost: data.service_cost,
                service_status: data.service_status,
                
                // Campos de Resolução
                budget_description: data.budget_description,
                services_performed: data.services_performed,
                parts: data.parts,
                feedback: data.feedback,
                
                // Datas e Pessoas
                delivery_forecast: data.delivery_forecast,
                delivery_date: data.delivery_date,
                responsible_technician: data.responsible_technician,
            },
        });
    }

    // 5. DELETE: Remove a OS
    async delete(id: number) {
        return prisma.order.delete({
            where: { id },
        });
    }
}