import { customerRepository } from "./customer.repository";
import { CreateCustomerDTO } from "./customer.schema";

class CustomerService {

    async findById(tenantId: number, id: number) {
        const searchedUser = customerRepository.findById(id, tenantId);
        return searchedUser;
    }

    async create(tenantId: number, data: CreateCustomerDTO) {
        // Regra de Negócio: Não duplicar CPF/CNPJ na mesma empresa
        if (data.cpf) {
            const customerExists = await customerRepository.findByCpf(data.cpf, tenantId);
            if (customerExists) {
                throw new Error("Já existe um cliente com este CPF/CNPJ.");
            }
        }

        return customerRepository.create(tenantId, data);
    }

    async update(tenantId: number, id: number, data: any) {
        // Verifica se existe
        const customer = await customerRepository.findById(id, tenantId);
        if (!customer) throw new Error("Cliente não encontrado.");

        // Verifica duplicidade se estiver trocando o CPF
        if (data.cpf && data.cpf !== customer.cpf) {
            const docExists = await customerRepository.findByCpf(data.cpf, tenantId);
            if (docExists) throw new Error("Já existe outro cliente com este CPF/CNPJ.");
        }

        return customerRepository.update(id, tenantId, data);
    }

    async list(tenantId: number) {
        return customerRepository.findAll(tenantId);
    }

    async delete(tenantId: number, id: number) {
        const customer = await customerRepository.findById(id, tenantId);
        if (!customer) throw new Error("Cliente não encontrado.");

        return customerRepository.delete(id, tenantId);
    }
}

export const customerService = new CustomerService();