import { MessageRepository } from "./message.repository";
import { CreateMessageDTO, UpdateMessageDTO } from "./message.schema";

const messageRepository = new MessageRepository();

export class MessageService {

    async list(tenantId: number) {
        return messageRepository.findAll(tenantId);
    }

    async listById(id: number, tenantId: number) {
        const message = await messageRepository.findById(id, tenantId);
        if (!message) throw new Error("Orçamento não encontrado.");
        return message;
    }

    async create(tenantId: number, data: CreateMessageDTO) {
        return messageRepository.create(tenantId, data);
    }

    async update(id: number, tenantId: number, data: UpdateMessageDTO) {
        const currentMessage = await messageRepository.findById(id, tenantId);
        if (!currentMessage) throw new Error("Orçamento não encontrado.");

        return messageRepository.update(id, tenantId, data);
    }

    async listMessagesPaginated(params: FindAllPaginatedParams) {
        return messageRepository.findAllMessagesPaginated(params)
    }

    async delete(id: number, tenantId: number) {
        const message = await messageRepository.findById(id, tenantId);
        if (!message) throw new Error("Orçamento não encontrado.");

        return messageRepository.delete(id);
    }
}