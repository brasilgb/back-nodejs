import { SaleRepository } from "./SaleRepository";


interface SaleInput {
  tenantId: number;
  customerId?: number;
  items: {
    productId: number;
    quantity: number;
    unitPrice: number;
  }[];
}

export class SaleService {
  private saleRepository: SaleRepository;

  constructor() {
    this.saleRepository = new SaleRepository();
  }

  async execute(data: SaleInput) {
    // 1. Calcular o valor total da venda no backend (Segurança)
    const totalAmount = data.items.reduce((acc, item) => {
      return acc + (item.quantity * item.unitPrice);
    }, 0);

    // 2. Gerar o próximo número de venda (Sequencial simples por tenant)
    const lastNumber = await this.saleRepository.getLastSaleNumber(data.tenantId);
    const nextSalesNumber = lastNumber + 1;

    // 3. Chamar o repositório
    const sale = await this.saleRepository.create({
      tenant_id: data.tenantId,
      customer_id: data.customerId || null,
      sales_number: nextSalesNumber,
      total_amount: totalAmount,
      items: data.items.map(item => ({
         product_id: item.productId,
         quantity: item.quantity,
         unit_price: item.unitPrice
      }))
    });

    // TODO: Aqui você poderia chamar um StockService.decreaseStock()

    return sale;
  }
}