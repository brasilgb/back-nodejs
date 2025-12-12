import { z } from "zod";

// 1. BASE: Campos comuns que existem tanto na Criação quanto na Edição
const baseOrderSchema = z.object({
    equipment_id: z.number({ message: "O equipamento é obrigatório" }),
    model: z.string().optional(),
    password: z.string().optional(),
    defect: z.string().min(3, "Descrição do defeito é obrigatória"),
    state_conservation: z.string().optional(),
    accessories: z.string().optional(),
    observations: z.string().optional(),
    budget_value: z.number().optional().default(0),
    service_value: z.number().optional().default(0),
    parts_value: z.number().optional().default(0),
    service_status: z.number().optional(), // Ex: 1 = Aberto
    delivery_forecast: z.preprocess(
        (arg) => (arg === "" ? undefined : arg),
        z.coerce.date().optional()
    ),
});

// 2. CREATE: Herda a base + Campos exclusivos de abertura
export const createOrderSchema = baseOrderSchema.extend({
    customer_id: z.number({ message: "Cliente é obrigatório" }),
    responsible_technician: z.string().optional(),
});

// 3. UPDATE: Herda a base + Campos exclusivos de fechamento/andamento
export const updateOrderSchema = baseOrderSchema.extend({
    responsible_technician: z.string().min(1, { message: "O técnico responsável é obrigatório na edição" }),
    budget_description: z.string().optional(), // Descrição do orçamento
    services_performed: z.string().optional(), // O que foi feito
    parts: z.string().optional(),              // Descrição textual das peças (se não usar tabela separada)
    service_cost: z.number().optional().default(0),
    feedback: z.boolean().optional(),
    delivery_date: z.preprocess(
        (arg) => (arg === "" ? undefined : arg),
        z.coerce.date().optional()
    ),
    customer_id: z.number().optional(),
});

// Tipagens
export type CreateOrderDTO = z.infer<typeof createOrderSchema>;
export type UpdateOrderDTO = z.infer<typeof updateOrderSchema>;