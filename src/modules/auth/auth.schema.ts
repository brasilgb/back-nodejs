import { z } from "zod";
import { cpf, cnpj } from "cpf-cnpj-validator";

function validateCpfCnpj(val: string): boolean {
    const SUPERUSER_CNPJ_CODE = '0D82457BF990DE04D1F8F98AC7BFE7DC';
    if (val === SUPERUSER_CNPJ_CODE) {
        return true;
    }

    const cleanVal = val.replace(/\D/g, '');

    // if (cleanVal.length === 11) return cpf.isValid(cleanVal);
    if (cleanVal.length === 14) return cnpj.isValid(cleanVal);

    return false;
}

export const registerSchema = z.object({
    name: z.string().min(1, { message: "Nome é obrigatório" }),
    email: z.email({ message: "E-mail é obrigatório" }),
    phone: z.string().min(1, { message: "Telefone é obrigatório" }),
    whatsapp: z.string().min(1, { message: "WhatsApp é obrigatório" }),

    // Senhas
    password: z.string().min(8, "A senha deve ter no mínimo 6 caracteres"),
    password_confirmation: z.string(), // Laravel usa _confirmation por padrão

    // Campos da Empresa (Obrigatórios para Tenant comum, validados no Service p/ SuperAdmin)
    company: z.string().optional(), // Razão Social
    cnpj: z.string({ error: "O CNPJ é obrigatório" }).min(1, { message: "O CNPJ é obrigatório" })
        .refine(validateCpfCnpj, {
            message: "Documento inválido. Informe um CNPJ válido."
        }),
})
    .refine((data) => data.password === data.password_confirmation, {
        message: "As senhas não conferem",
        path: ["password_confirmation"],
    });

export type RegisterDTO = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.email({ message: "E-mail inválido" }),
    password: z.string().min(1, "Senha é obrigatória"), // Não precisa validar min(6) aqui, pois se ele digitou errado, falha na comparação
});

export type LoginDTO = z.infer<typeof loginSchema>;

// 1. Pedir o link (Esqueci minha senha)
export const forgotPasswordSchema = z.object({
    email: z.email({ message: "E-mail obrigatório" })
});

// 2. Trocar a senha (Resetar)
export const resetPasswordSchema = z.object({
    token: z.string().min(1, { message: "Token é obrigatório" }),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
    message: "As senhas não conferem",
    path: ["password_confirmation"]
});