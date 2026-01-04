import { z } from "zod";

export const createMessageSchema = z.object({
  sender_id: z.coerce.number("O cliente é obrigatório"),
  recipient_id: z.coerce.number("O técnico é obrigatório"),
  title: z.string().min(1, {message: "O serviço é obrigatório"}),
  message: z.string().min(1, {message: "O detalhe do serviço é obrigatório"}),
  status: z.coerce.number({ message: "O status é obrigatório" }),
});

// O partial() é excelente aqui para patches/updates parciais
export const updateMessageSchema = createMessageSchema.partial();

export type CreateMessageDTO = z.infer<typeof createMessageSchema>;
export type UpdateMessageDTO = z.infer<typeof updateMessageSchema>;