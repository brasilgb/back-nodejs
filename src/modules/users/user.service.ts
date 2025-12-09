import { userRepository } from "./user.repository.js";


type UserData = {
    name: string;
    email: string;
}

export const userService = {
    async findAll() {
        return await userRepository.getAll();
    },

    async create(data: UserData) {
        const existingUser = await userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error("E-mail já cadastrado");
        }
        return userRepository.save(data);
    }
}