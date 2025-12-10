import z from "zod";
import { createTenantSchema } from "./tenant.schema";
import { tenantRepository } from "./tenant.repository";
import { Tenant } from "../../generated/prisma/client";

export type CreateTenantDTO = z.infer<typeof createTenantSchema>;

export const tenantService = {
    async findAll() {
        return await tenantRepository.getAll();
    },

    async findById(id: number) {
        const searchedTenant = tenantRepository.findById(id);
        return searchedTenant;
    },

    async create(data: CreateTenantDTO): Promise<Tenant> {
        const existingCnpj = await tenantRepository.findByCnpj(data.cnpj);
        const existingEmail = await tenantRepository.findByEmail(data.email);
        if (existingCnpj) {
            throw new Error("CNPJ está cadastrado");
        }

        if (existingEmail) {
            throw new Error("E-mail já cadastrado");
        }

        return tenantRepository.save(data)
    },

    async update(id: number, data: any) {
        const tenantExists = await tenantRepository.findById(id);
        if (!tenantExists) {
            throw new Error("Tenant não encontrado");
        }

        // --- Validação de Email ---
        if (data.email) {
            const tenantWithSameEmail = await tenantRepository.findByEmail(data.email);
            if (tenantWithSameEmail && tenantWithSameEmail.id !== id) {
                throw new Error("Este e-mail já está cadastrado");
            }
        }

        // --- Validação de CNPJ ---
        if (data.cnpj) {
            // 💡 CORREÇÃO AQUI: Troquei data.Cnpj por data.cnpj
            const tenantWithSameCnpj = await tenantRepository.findByCnpj(data.cnpj);
            
            if (tenantWithSameCnpj && tenantWithSameCnpj.id !== id) {
                throw new Error("Este CNPJ já está cadastrado");
            }
        }

        return tenantRepository.edit(id, data);
    },

    async delete(id: number) {
        const tenantExists = await tenantRepository.findById(id);

        if (!tenantExists) {
            throw new Error("Tenant não encontrado");
        }
        return tenantRepository.destroy(id);
    }

}