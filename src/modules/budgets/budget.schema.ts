import { z } from "zod";

export const createBudgetSchema = z.object({
  // Adicionando .min(1) para garantir que não fiquem vazios
  category: z
    .any() // Aceita a entrada inicial para não quebrar no null/undefined
    .transform((val) => (val === null || val === undefined ? "" : val)) // Normaliza
    .pipe(z.string().min(1, "Categoria é obrigatória")),
  service: z.string().min(1, "Nome do serviço é obrigatório"),
  model: z.string().optional(),
  description: z.string().min(1, "Descrição é obrigatória"),
  estimated_time: z.string().min(1, "Tempo estimado é obrigatório"),
  warranty: z
    .any() // Aceita a entrada inicial para não quebrar no null/undefined
    .transform((val) => (val === null || val === undefined ? "" : val)) // Normaliza
    .pipe(z.string().min(1, "Garantia é obrigatória")),
  part_value: z.coerce.number({ message: "Valor inválido" }).default(0),
  labor_value: z.coerce.number({ message: "Valor da mão de obra é obrigatório" }),
  total_value: z.coerce.number({ message: "Valor total é obrigatório" }),
  obs: z.string().optional(),
});

// O partial() é excelente aqui para patches/updates parciais
export const updateBudgetSchema = createBudgetSchema.partial();

export type CreateBudgetDTO = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetDTO = z.infer<typeof updateBudgetSchema>;