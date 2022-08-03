import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Product } from 'src/typeorm/entities/product.entitie';
import { Like, Repository } from 'typeorm';
import { CreateProductDto, EditProductDto } from './dto/request';

@Injectable()
export class ProductService {
  constructor(
    @Inject('PRODUCT_REPOSITORY')
    private productRepository: Repository<Product>,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.find({
      order: {
        createdAt: 'asc',
      },
      cache: true,
    });
  }
  async filterProducts(
    productName = '',
    restaurantId: number,
  ): Promise<Product[]> {
    return this.productRepository.find({
      where: {
        name: Like(`%${productName}%`),
        restaurant: { id: restaurantId },
      },
      order: {
        createdAt: 'asc',
      },
      cache: true,
    });
  }
  async createProduct(product: CreateProductDto): Promise<Product> {
    try {
      const productRecord = await this.productRepository.save({
        ...product,
        createdAt: new Date(),
      });
      return productRecord;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
  async editProductById(
    productId: number,
    restaurantId: number,
    dto: EditProductDto,
  ) {
    try {
      let findProduct = await this.productRepository.findOne({
        where: { id: productId, restaurant: { id: restaurantId } },
      });
      if (!findProduct)
        throw new ForbiddenException('Access to resources denied');

      await this.productRepository.update(
        {
          id: findProduct.id,
        },
        { ...dto, updatedAt: new Date() },
      );
      findProduct = await this.productRepository.findOne({
        where: { id: productId, restaurant: { id: restaurantId } },
      });
      return findProduct;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
  async deleteProductById(productId: number, restaurantId: number) {
    try {
      const findProduct = await this.productRepository.findOne({
        where: { id: productId, restaurant: { id: restaurantId } },
      });
      if (!findProduct)
        throw new ForbiddenException('Access to resources denied');

      await this.productRepository.delete({
        id: findProduct.id,
      });
      return findProduct;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
