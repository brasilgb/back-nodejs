import { hash } from "bcryptjs";
import { User } from "../../generated/prisma/client";
import { userRepository } from "./user.repository";
import z from "zod";
import { createUserSchema } from "./user.schema";

export type CreateUserDTO = z.infer<typeof createUserSchema>;

export const userService = {
    async findAll() {
        return await userRepository.getAll();
    },

    async findById(id: number) {
        const searchedUser = userRepository.findById(id);
        return searchedUser;
    },

    async create(tenantId: number, data: CreateUserDTO): Promise<User> {
        const existingUser = await userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error("E-mail já cadastrado");
        }

        const passwordHash = await hash(data.password, 8);

        const userToCreate = {
            ...data,
            password: passwordHash
        }
        return userRepository.save(tenantId, userToCreate);
    },

    async update(id: number, data: any) {
        const userExists = await userRepository.findById(id);
        if (!userExists) {
            throw new Error("Usuário não encontrado");
        }

        if (data.email) {
            const userWithSameEmail = await userRepository.findByEmail(data.email);
            if (userWithSameEmail && userWithSameEmail.id !== id) {
                throw new Error("Este e-mail já está cadastrado");
            }
        }

        if (data.password) {
            data.password = await hash(data.password, 8);
        }

        return userRepository.edit(id, data);
    },

    async delete(id: number) {
        const userExists = await userRepository.findById(id);

        if (!userExists) {
            throw new Error("Usuário não encontrado");
        }
        return userRepository.destroy(id);
    }


}