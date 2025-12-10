import { Request, Response, NextFunction } from "express";
// 1. Importe ZodObject em vez de AnyZodObject
import { ZodObject, ZodError } from "zod";

// 2. Use ZodObject<any> para aceitar qualquer objeto Zod
export const validate = (schema: ZodObject<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    message: "Erro de validação",
                    errors: error.issues.map((err) => ({
                        field: err.path[0],
                        message: err.message
                    }))
                });
            }
            return res.status(500).json({ message: "Erro interno de validação" });
        }
    };
};