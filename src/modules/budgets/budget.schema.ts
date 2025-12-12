import { z } from "zod";

export const createBudgetSchema = z.object({
  category: z.string({ message: "Categoria é obrigatória" }),
  service: z.string({ message: "Nome do serviço é obrigatório" }),
  model: z.string().optional(),
  description: z.string({ message: "Descrição é obrigatória" }),
  estimated_time: z.string({ message: "Tempo estimado é obrigatório" }), 
  warranty: z.string({ message: "Garantia é obrigatória" }),
  part_value: z.coerce.number({ message: "Valor inválido" }).optional().default(0),
  labor_value: z.coerce.number({ message: "Valor da mão de obra é obrigatório" }),
  total_value: z.coerce.number({ message: "Valor total é obrigatório" }),
  obs: z.string().optional(),
});

// O partial() torna tudo opcional para o update
export const updateBudgetSchema = createBudgetSchema.partial();

export type CreateBudgetDTO = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetDTO = z.infer<typeof updateBudgetSchema>;