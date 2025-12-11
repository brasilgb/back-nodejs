import z from "zod";
import { cpf, cnpj } from "cpf-cnpj-validator";
function validateCpfCnpj(val: string): boolean {
    // Garante que só tem números (caso a função seja chamada fora do Zod)
    const cleanVal = val.replace(/\D/g, '');

    // if (cleanVal.length === 11) return cpf.isValid(cleanVal);
    if (cleanVal.length === 14) return cnpj.isValid(cleanVal);

    return false;
}

export const createTenantSchema = z.object({
    plan: z.number({ error: "O plano deve ser selecionado" }),
    name: z.string().optional(),
    company: z.string().min(1, { message: "O nome é obrigatório" }),
    cnpj: z.string().min(1, { message: "O CNPJ é obrigatório" })
        .refine(validateCpfCnpj, {
            message: "Documento inválido. Informe um CNPJ válido."
        }),
    email: z.email({ message: "Digite um e-mail válido" }),
    phone: z.string().min(1, { message: "O telefone é obrigatório" }),
    whatsapp: z.string().optional(),
    zip_code: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    district: z.string().optional(),
    street: z.string().optional(),
    complement: z.string().optional(),
    number: z.string().optional(),
    status: z.number({ error: "O selecione o status" }),
    payment: z.boolean().optional(),
    observations: z.string().optional(),
    expiration_date: z.string().optional()
});
export const updateTenantSchema = createTenantSchema.partial();