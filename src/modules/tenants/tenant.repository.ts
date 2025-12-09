import { prisma } from "../../lib/prisma";


export const tenantRepository = {
    async getAll() {
        const allTenants = await prisma.tenant.findMany();
        return allTenants;
    }
}