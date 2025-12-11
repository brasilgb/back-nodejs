import { prisma } from "../../lib/prisma";
import { RegisterDTO } from "./auth.schema";

class AuthRepository {

    // Verifica se já existe SuperUsuário (tenant_id null)
    async findSuperUser() {
        return prisma.user.findFirst({
            where: { tenant_id: null }
        });
    }

    // Cria APENAS o Super Usuário (Sem tenant)
    async createSuperUser(data: any) {
        return prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password, // Já vem hashada do service
                status: 1,
                tenant_id: null
            }
        });
    }

    async createTenantTransaction(data: RegisterDTO, hashedPassword: string) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);

        // $transaction garante que tudo roda ou nada roda
        return prisma.$transaction(async (tx) => {
            
            // 1. Cria o Tenant
            const newTenant = await tx.tenant.create({
                data: {
                    name: data.name,
                    company: data.company!, // ! garante que não é undefined aqui
                    cnpj: data.cnpj!,
                    email: data.email,
                    phone: data.phone,
                    whatsapp: data.whatsapp,
                    status: 1,
                    plan: 1,
                    expiration_date: expirationDate
                }
            });

            // 2. Cria o Usuário Admin vinculado ao Tenant
            const newUser = await tx.user.create({
                data: {
                    name: data.name,
                    email: data.email,
                    password: hashedPassword,
                    tenant_id: newTenant.id, // Link com o tenant criado acima
                    // telephone: data.phone, // Verifique se seu schema User tem esse campo
                    // whatsapp: data.whatsapp,
                    // status: 1,
                    // roles: 9
                }
            });

            // 3. Cria a Company vinculada ao Tenant
            await tx.company.create({
                data: {
                    tenant_id: newTenant.id,
                    companyname: data.company!,
                    cnpj: data.cnpj!,
                    telephone: data.phone,
                    whatsapp: data.whatsapp,
                    email: data.email
                }
            });

            return { user: newUser, tenant: newTenant };
        });
    }

    // Salva o token no usuário
    async saveResetToken(userId: number, token: string, expiry: Date) {
        return prisma.user.update({
            where: { id: userId },
            data: {
                reset_token: token,
                reset_token_expiry: expiry
            }
        });
    }

    // Busca usuário pelo token (se o token ainda não expirou)
    async findByResetToken(token: string) {
        return prisma.user.findFirst({
            where: {
                reset_token: token,
                reset_token_expiry: {
                    gt: new Date() // "gt" = Greater Than (Maior que AGORA)
                }
            }
        });
    }

    // Atualiza a senha e LIMPA o token (para não ser usado de novo)
    async updatePasswordAndClearToken(userId: number, newPasswordHash: string) {
        return prisma.user.update({
            where: { id: userId },
            data: {
                password: newPasswordHash,
                reset_token: null,       // Limpa
                reset_token_expiry: null // Limpa
            }
        });
    }
}

export const authRepository = new AuthRepository();