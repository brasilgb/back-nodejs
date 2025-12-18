import { z } from "zod";
import { cpf, cnpj } from "cpf-cnpj-validator";

function validateCpfCnpj(val: string): boolean {
    if (!val) return false;

    const cleanVal = val.replace(/\D/g, "");

    if (cleanVal.length === 11) return cpf.isValid(cleanVal);
    if (cleanVal.length === 14) return cnpj.isValid(cleanVal);

    return false;
}

export const createCustomerSchema = z.object({
    name: z.string().min(1, { message: "Nome é obrigatório" }),

    cpf: z
        .string()
        .min(1, { message: "O CPF/CNPJ é obrigatório" })
        .transform(val => val.trim())
        .refine(validateCpfCnpj, {
            message: "Documento inválido. Informe um CPF ou CNPJ válido.",
        }),

    birth: z.preprocess(
        arg => (arg === "" || arg === null ? undefined : arg),
        z.coerce.date().optional()
    ),

    email: z
        .string()
        .transform(val => val.trim())
        .refine(
            val => val === "" || z.string().email().safeParse(val).success,
            { message: "Digite um e-mail válido" }
        )
        .optional(),

    phone: z.string().min(1, { message: "Telefone é obrigatório" }),
    whatsapp: z.string().min(1, { message: "Whatsapp é obrigatório" }),

    zipcode: z.string().optional(),
    state: z.string().max(2).optional(),
    city: z.string().optional(),
    district: z.string().optional(),
    street: z.string().optional(),
    complement: z.string().optional(),

    number: z.coerce.number().optional(),

    contactname: z.string().optional(),
    contactphone: z.string().optional(),
    observations: z.string().optional(),
});

export type CreateCustomerDTO = z.infer<typeof createCustomerSchema>;
export const updateCustomerSchema = createCustomerSchema.partial();