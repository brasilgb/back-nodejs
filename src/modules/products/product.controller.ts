import { Request, Response } from "express";
import { ProductService } from "./product.service";
import { createProductSchema, updateProductSchema } from "./product.schema";

const productService = new ProductService();

class ProductController {

    async list(req: Request, res: Response) {
        const tenantId = req.user?.tenant_id
        if (!tenantId) {
            return res.status(403).json({ message: "Acesso negado" })
        }

        const page = Number(req.query.page ?? 1)
        const pageSize = Number(req.query.pageSize ?? 11)
        const search = String(req.query.search ?? "")
        const sortBy = req.query.sortBy as any
        const sortDir = req.query.sortDir as any

        const products = await productService.listProductsPaginated({
            tenantId,
            page,
            pageSize,
            search,
            sortBy,
            sortDir,
        })

        return res.json(products)
    }

    async listById(req: Request, res: Response) {
        const tenantId = req.user?.tenant_id;
        const { id } = req.params;
        if (!tenantId) return res.status(403).json({ message: "Acesso negado" });

        try {
            const product = await productService.listById(Number(id), tenantId);
            return res.json(product);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async create(req: Request, res: Response) {
        const tenantId = req.user?.tenant_id;
        if (!tenantId) return res.status(403).json({ message: "Acesso negado" });

        try {
            const data = createProductSchema.parse(req.body);
            const product = await productService.create(tenantId, data);
            return res.status(201).json(product);
        } catch (error: any) {
            console.log('error', error);
            
            return res.status(400).json({ error: error.message || error });
        }
    }

    async update(req: Request, res: Response) {
        const tenantId = req.user?.tenant_id;
        const { id } = req.params;
        if (!tenantId) return res.status(403).json({ message: "Acesso negado" });

        try {
            const data = updateProductSchema.parse(req.body);
            const product = await productService.update(Number(id), tenantId, data);
            return res.json(product);
        } catch (error: any) {
            return res.status(400).json({ error: error.message || error });
        }
    }

    async delete(req: Request, res: Response) {
        const tenantId = req.user?.tenant_id;
        const { id } = req.params;
        if (!tenantId) return res.status(403).json({ message: "Acesso negado" });

        try {
            await productService.delete(Number(id), tenantId);
            return res.status(200).json({ message: "Orçamento deletado com sucesso" });
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}

export const productController = new ProductController();