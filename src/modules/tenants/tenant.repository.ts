import { Prisma, Tenant } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";


export const tenantRepository = {
    async getAll() {
        const allTenants = await prisma.tenant.findMany();
        return allTenants;
    },

    async findById(id: number): Promise<Tenant | null> {
        const findTenantForId = await prisma.tenant.findUnique({
            where: { id }
        });
        return findTenantForId;
    },

    async findByEmail(email: string): Promise<Tenant | null> {
        const findTenantForEmail = await prisma.tenant.findUnique({
            where: { email }
        });
        return findTenantForEmail;
    },

    async findByCnpj(cnpj: string): Promise<Tenant | null> {
        const findTenantForCnpj = await prisma.tenant.findUnique({
            where: { cnpj }
        });
        return findTenantForCnpj;
    },

    async save(data: Prisma.TenantCreateInput): Promise<Tenant> {
        const newTenant = await prisma.tenant.create({
            data: data
        });
        return newTenant;
    },

    async edit(id: number, data: Prisma.TenantUpdateInput): Promise<Tenant> {
        const editTenant = await prisma.tenant.update({
            where: {
                id: id
            },
            data: data
        });
        return editTenant
    },

    async destroy(id: number): Promise<Tenant> {
        const destroyTenant = await prisma.tenant.delete({
            where: { id }
        });
        return destroyTenant;
    }

}