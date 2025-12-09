import { prisma } from "../../lib/prisma.js";



export const userRepository = {
    async getAll() {
        const allUsers = await prisma.user.findMany();
        return allUsers;
    },

    async findByEmail(email: string) {
        const findUserForEmail = await prisma.user.findUnique({email});
        return findUserForEmail;
    },

    async save(data: { name: string, email: string }) {
        const newUser = await prisma.user.create({data});
        return newUser;
    },
}