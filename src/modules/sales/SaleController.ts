import { Request, Response } from "express";
import { SaleService } from "./SaleService";


export class SaleController {

  async handle(req: Request, res: Response) {
    const tenantId = req.user?.tenant_id
    if (!tenantId) {
      return res.status(403).json({ message: "Acesso negado" })
    }
    const { customerId, items } = req.body;

    // Validação básica
    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Carrinho vazio" });
    }

    const saleService = new SaleService();

    try {
      const sale = await saleService.execute({
        customerId,
        tenantId, // Geralmente vem do req.user ou token, cuidado ao pegar do body
        items,
      });

      return res.status(201).json(sale);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao processar venda" });
    }
  }
}

export const saleController = new SaleController();