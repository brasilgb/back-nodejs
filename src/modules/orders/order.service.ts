import { customerRepository } from "../customers/customer.repository";
import { OrderRepository } from "./order.repository"; // Importe seu repo de clientes
// import { EquipmentRepository } from "../equipments/equipment.repository"; // Se tiver repo de equipamentos

import { CreateOrderDTO, UpdateOrderDTO } from "./order.schema";

const orderRepository = new OrderRepository();
// const equipmentRepository = new EquipmentRepository();

export class OrderService {
    // 3. FIND BY ID
    async findById(id: number, tenantId: number) {
        const order = await orderRepository.findById(id, tenantId);

        if (!order) {
            throw new Error("Ordem de Serviço não encontrada.");
        }

        return order;
    }
    
    // 1. CREATE
    async create(tenantId: number, data: CreateOrderDTO) {
           // Tudo certo, cria a OS
        return orderRepository.create(tenantId, data);
    }

    // 2. FIND ALL
    async listOrderPaginated(params: FindAllPaginatedParams) {
        return orderRepository.findAllOrdersPaginated(params);
    }


    // 4. UPDATE
    async update(id: number, tenantId: number, data: UpdateOrderDTO) {
        // Passo 1: Verifica se a OS existe antes de tentar editar
        // Isso impede erro de Prisma "Record not found" e garante segurança do Tenant
        const existingOrder = await orderRepository.findById(id, tenantId);

        if (!existingOrder) {
            throw new Error("Ordem de Serviço não encontrada.");
        }

        // Passo 2: Se estiver trocando o cliente (raro, mas possível), valida o novo
        if (data.customer_id && data.customer_id !== existingOrder.customer_id) {
            const customer = await customerRepository.findById(data.customer_id, tenantId);
            if (!customer) throw new Error("Novo cliente informado não encontrado.");
        }

        return orderRepository.update(id, tenantId, data);
    }

    // 5. DELETE
    async delete(id: number, tenantId: number) {
        // Passo 1: Verifica se existe
        const existingOrder = await orderRepository.findById(id, tenantId);

        if (!existingOrder) {
            throw new Error("Ordem de Serviço não encontrada.");
        }

        // Passo 2: Remove
        return orderRepository.delete(id);
    }
}