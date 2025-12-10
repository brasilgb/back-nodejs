import { z } from "zod";

export const createUserSchema = z.object({
    name: z.string({ error: "O nome é obrigatório" }).min(1, { message: "O nome é obrigatório" }),
    email: z.email({ message: "Digite um e-mail válido" }),
    roles: z.number({ error: "Selecione a função do usuário" }),
    password: z.string({ error: "Senha é obrigatória" }).min(8, { message: "A senha deve ter no mínimo 8 caracteres" }),
    retype_password: z.string({ error: "Confirmar a senha é obrigatório" }).min(1, { message: "Confirmar a senha é obrigatório" }),
    telephone: z.string().optional(),
    whatsapp: z.string().optional(),
    status: z.number().optional(),
    email_verified_at: z.date().optional(),
    remember_token: z.string().optional()
}).refine((data) => data.password === data.retype_password, {
    message: "As senhas não conferem",
    path: ["retype_password"],
});
export const updateUserSchema = createUserSchema.partial();