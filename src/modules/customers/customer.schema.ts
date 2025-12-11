import { z } from "zod";
import { cpf, cnpj } from "cpf-cnpj-validator";

function validateCpfCnpj(val: string): boolean {
    // Garante que só tem números (caso a função seja chamada fora do Zod)
    const cleanVal = val.replace(/\D/g, '');

    if (cleanVal.length === 11) return cpf.isValid(cleanVal);
    if (cleanVal.length === 14) return cnpj.isValid(cleanVal);

    return false;
}
export const createCustomerSchema = z.object({
    name: z.string().min(1, { message: "Nome é obrigatório" }),
    // Aceita CPF ou CNPJ no campo 'cpf' do banco
    cpf: z.string().min(1, { message: "O CPF/CNPJ é obrigatório" })
        .refine(validateCpfCnpj, {
            message: "Documento inválido. Informe um CPF/CNPJ válido."
        }),
    // Converte string "YYYY-MM-DD" para Date
    birth: z.preprocess((arg) => (arg === "" ? undefined : arg), z.coerce.date().optional()),
    email: z.email({ message: "Digite um e-mail válido" }),
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
    // Endereço
    cep: z.string().optional(),
    state: z.string().max(2).optional(), // UF geralmente são 2 letras
    city: z.string().optional(),
    district: z.string().optional(),
    street: z.string().optional(),
    complement: z.string().optional(),
    // Converte "123" (string) para 123 (number)
    number: z.coerce.number().optional(),
    // Contato
    contactname: z.string().optional(),
    contactphone: z.string().optional(),
    observations: z.string().optional(),
});

export type CreateCustomerDTO = z.infer<typeof createCustomerSchema>;
export const updateCustomerSchema = createCustomerSchema.partial();