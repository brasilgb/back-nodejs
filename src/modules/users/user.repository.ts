import { Prisma, User } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

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

    async save(data: Prisma.UserCreateInput): Promise<User> {
        const newUser = await prisma.user.create({
            data: data
        });
        return newUser;
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

    async destroy(id:number): Promise<User> {
        const destroyUser = await prisma.user.delete({
            where: { id }
        });
        return destroyUser;
    },
}