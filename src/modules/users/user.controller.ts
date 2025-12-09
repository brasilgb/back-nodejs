import { Request, Response } from 'express';
import { userService } from './user.service.js';

export const userController = {
    async list(req: Request, res: Response): Promise<Response> {

        try {
            const users = await userService.findAll();
            return res.status(200).json({ users });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao listar usuários' })
        }
    },

    async create(req: Request, res: Response): Promise<Response> {
        const userData = req.body;

        try {
            const newUser = await userService.create(userData);
            return res.status(201).json(newUser);
        } catch (error) {
            return res.status(400).json({ message: "Erro ao criar usuário" })
        }

    }


}