import { Request, Response } from "express"; // ou NextRequest se for Next App Router
import { SaleService } from "./SaleService";


export class SaleController {
  async handle(req: Request, res: Response) {
    const { customerId, items, tenantId } = req.body;

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