import { customerRepository } from "./customer.repository";
import { CreateCustomerDTO } from "./customer.schema";

class CustomerService {

    async findById(tenantId: number, id: number) {
        const searchedUser = customerRepository.findById(id, tenantId);

        if (!searchedUser) {
            throw new Error("Cliente não encontrado.");
        }

        return searchedUser;
    }

    async create(tenantId: number, data: CreateCustomerDTO) {
        // Regra de Negócio: Não duplicar CPF/CNPJ na mesma empresa
        if (data.cpf) {
            const cpfExists = await customerRepository.findByCpf(data.cpf, tenantId);
            if (cpfExists) {
                throw new Error("Já existe um cliente com este CPF/CNPJ.");
            }
        }

        // 2. Regra de Negócio: E-mail único por empresa (NOVO)
        if (data.email) {
            // Usa o mesmo método que criamos no passo anterior
            const emailExists = await customerRepository.findByEmail(data.email, tenantId);

            if (emailExists) {
                throw new Error("Já existe um cliente com este e-mail.");
            }
        }

        return customerRepository.create(tenantId, data);
    }

    async update(tenantId: number, id: number, data: any) {
        // Verifica se existe
        const customer = await customerRepository.findById(id, tenantId);
        if (!customer) throw new Error("Cliente não encontrado.");

        // 2. Validação de duplicidade de CPF (só se mudou)
        if (data.cpf && data.cpf !== customer.cpf) {
            const cpfExists = await customerRepository.findByCpf(data.cpf, tenantId);
            if (cpfExists) throw new Error("Já existe outro cliente com este CPF/CNPJ.");
        }

        // 3. Validação de duplicidade de E-mail (só se mudou)
        if (data.email && data.email !== customer.email) {
            // Verifica se já existe ALGUÉM com esse email no mesmo tenant
            const emailExists = await customerRepository.findByEmail(data.email, tenantId);

            // Se encontrou alguém, bloqueia
            if (emailExists) {
                throw new Error("Já existe outro cliente cadastrado com este e-mail.");
            }
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