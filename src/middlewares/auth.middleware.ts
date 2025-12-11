import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
    id: number;
    email: string;
    tenant_id: number | null;
    iat: number;
    exp: number;
}

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    const authToken = req.headers.authorization;

    if (!authToken) {
        return res.status(401).json({ message: "Token não informado" });
    }

    // Separa "Bearer" do "eyJ..."
    const [, token] = authToken.split(" ");

    // 🛑 CORREÇÃO AQUI: 
    // O TypeScript reclamava que 'token' poderia ser undefined.
    // Agora verificamos se ele existe antes de prosseguir.
    if (!token) {
        return res.status(401).json({ message: "Token malformatado" });
    }

    try {
        const secret = process.env.JWT_SECRET;
        
        // Verifica se a variável de ambiente existe
        if (!secret) {
            throw new Error("Erro de configuração: JWT_SECRET não encontrado");
        }

        // Verifica o token
        const decoded = jwt.verify(token, secret) as unknown as TokenPayload;

        const { id, email, tenant_id } = decoded;

        req.user = {
            id,
            email,
            tenant_id
        };

        return next();

    } catch (error) {
        return res.status(401).json({ message: "Token inválido ou expirado" });
    }
}