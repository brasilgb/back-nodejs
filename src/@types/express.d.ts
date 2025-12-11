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