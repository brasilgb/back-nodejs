import { ProductRepository } from "./product.repository";
import { CreateProductDTO, UpdateProductDTO } from "./product.schema";

const productRepository = new ProductRepository();

export class ProductService {

    async list(tenantId: number) {
        return productRepository.findAll(tenantId);
    }

    async listById(id: number, tenantId: number) {
        const product = await productRepository.findById(id, tenantId);
        if (!product) throw new Error("Produto não encontrado.");
        return product;
    }

    async create(tenantId: number, data: CreateProductDTO) {
        return productRepository.create(tenantId, data);
    }

    async update(id: number, tenantId: number, data: UpdateProductDTO) {
        const currentProduct = await productRepository.findById(id, tenantId);
        if (!currentProduct) throw new Error("Produto não encontrado.");

        return productRepository.update(id, tenantId, data);
    }

    async listProductsPaginated(params: FindAllPaginatedParams) {
        return productRepository.findAllProductsPaginated(params)
    }

    async delete(id: number, tenantId: number) {
        const product = await productRepository.findById(id, tenantId);
        if (!product) throw new Error("Produto não encontrado.");

        return productRepository.delete(id);
    }
}