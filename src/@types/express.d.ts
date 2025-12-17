// src/@types/express.d.ts

declare namespace Express {
    export interface Request {
        // Injetamos a propriedade user na requisição
        user?: {
            id: number;
            email: string;
            tenant_id: number | null;
        }
    }
}

interface FindAllPaginatedParams {
    tenantId: number
    page: number
    pageSize: number
    search?: string
    sortBy?: "name" | "cpf" | "created_at"
    sortDir?: "asc" | "desc"
}