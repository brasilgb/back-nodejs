import { prisma } from "../../lib/prisma";

interface CreateSaleDTO {
  tenant_id: number;
  customer_id: number | null;
  sales_number: number;
  total_amount: number;
  items: {
    product_id: number;
    quantity: number;
    unit_price: number;
  }[];
}

export class SaleRepository {
  async create(data: CreateSaleDTO) {
    // O Prisma cria a Venda (Sale) E os Itens (SaleItem) automaticamente
    return await prisma.sale.create({
      data: {
        tenant_id: data.tenant_id,
        customer_id: data.customer_id,
        sales_number: data.sales_number,
        total_amount: data.total_amount,
        // Nested Write: A mágica acontece aqui
        sale_items: {
          create: data.items.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
          })),
        },
      },
      include: {
        sale_items: true, // Retorna os itens criados na resposta
      },
    });
  }

  // Helper para pegar o último número de venda (opcional)
  async getLastSaleNumber(tenantId: number): Promise<number> {
    const lastSale = await prisma.sale.findFirst({
      where: { tenant_id: tenantId },
      orderBy: { sales_number: "desc" },
    });
    return lastSale?.sales_number || 0;
  }
}