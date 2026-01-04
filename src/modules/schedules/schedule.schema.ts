import { z } from "zod";

export const createScheduleSchema = z.object({
  customer_id: z.coerce.number("O cliente é obrigatório"),
  user_id: z.coerce.number("O técnico é obrigatório"),
  schedules: z.string()
  .min(1, "A data e hora são obrigatórias")
  .refine(val => !isNaN(Date.parse(val)), {
    message: "Data inválida. Escolha um dia e horário real."
  })
  .transform(val => new Date(val)),
  service: z.string().min(1, {message: "O serviço é obrigatório"}),
  details: z.string().min(1, {message: "O detalhe do serviço é obrigatório"}),
  status: z.coerce.number({ message: "O status é obrigatório" }),
  observations: z.string().optional(),
});

// O partial() é excelente aqui para patches/updates parciais
export const updateScheduleSchema = createScheduleSchema.partial();

export type CreateScheduleDTO = z.infer<typeof createScheduleSchema>;
export type UpdateScheduleDTO = z.infer<typeof updateScheduleSchema>;