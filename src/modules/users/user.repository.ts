import { Prisma, User } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { getNextSequence } from "../../utils/sequence";

export const userRepository = {
    async getAll() {
        const allUsers = await prisma.user.findMany();
        return allUsers;
    },

    async findByEmail(email: string): Promise<User | null> {
        const findUserForEmail = await prisma.user.findUnique({
            where: { email }
        });
        return findUserForEmail;
    },

    async findById(id: number): Promise<User | null> {
        const findUserForId = await prisma.user.findUnique({
            where: { id }
        });
        return findUserForId;
    },

    async save(tenantId: number, data: any): Promise<User> {

        // Usamos $transaction para garantir segurança na contagem
        return prisma.$transaction(async (tx) => {

            // 1. Calcula o próximo user_number para este tenant
            // Passamos 'tx.user' para usar a conexão da transação
            const nextNumber = await getNextSequence(tx.user, tenantId, 'user_number');

            // 2. Cria o usuário injetando o tenant_id e o user_number
            const newUser = await tx.user.create({
                data: {
                    ...data,              // Dados do formulário (nome, email, senha...)
                    tenant_id: tenantId,
                    user_number: nextNumber // 🔢 Aqui entra o número calculado (1, 2, 3...)
                }
            });

            return newUser;
        });
    },

    async edit(id: number, data: Prisma.UserUpdateInput): Promise<User> {
        const editUser = await prisma.user.update({
            where: {
                id: id
            },
            data: data
        });
        return editUser;
    },

    async destroy(id: number): Promise<User> {
        const destroyUser = await prisma.user.delete({
            where: { id }
        });
        return destroyUser;
    },
}