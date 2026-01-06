import { z } from "zod";

export const createProductSchema = z.object({
  // Adicionando .min(1) para garantir que não fiquem vazios
  category: z
    .any() // Aceita a entrada inicial para não quebrar no null/undefined
    .transform((val) => (val === null || val === undefined ? "" : val)) // Normaliza
    .pipe(z.string().min(1, "Categoria é obrigatória")),

  part_number: z.string().min(1, "O N° da peça/produto é obrigatório"),
  name: z.string().min(1, "O nome da peça/produto é obrigatório"),
  description: z.string().min(1, "A descrição é obrigatória"),
  manufacturer: z.string().min(1, "O fabricante é obrigatório"),
  model_compatibility: z.string().optional(),
  location: z.string().optional(),
  cost_price: z.coerce.number({ message: "Valor do custo é obigatório" }),
  sale_price: z.coerce.number({ message: "Valor da venda é obrigatório" }),
  quantity: z.coerce.number({ message: "A quantidade em estoque é obrigatório" }),
  minimum_stock_level: z.coerce.number({ message: "A quantidade mínima é obrigatório" }),
  status: z.coerce.number().optional(),
});

// O partial() é excelente aqui para patches/updates parciais
export const updateProductSchema = createProductSchema.partial();

export type CreateProductDTO = z.infer<typeof createProductSchema>;
export type UpdateProductDTO = z.infer<typeof updateProductSchema>;