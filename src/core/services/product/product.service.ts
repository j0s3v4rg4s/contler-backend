import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HotelEntity, ProductEntity } from '../../entity';
import { getConnection, Repository } from 'typeorm';
import { ProductRequest } from '../../models/product-request';

@Injectable()
export class ProductService {
  constructor(@InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>) {}

  async create(request: ProductRequest) {
    const hotelRepo = getConnection().getRepository(HotelEntity);
    const hotel = await hotelRepo.findOne(request.hotelId);
    const product = this.productRepository.create();
    product.hotel = hotel;
    product.category = request.category;
    product.description = request.description;
    product.name = request.name;
    product.value = request.value;
    return this.productRepository.save(product);
  }

  async getAllProducts(hotelId: string) {
    const hotelRepo = getConnection().getRepository(HotelEntity);
    const hotel = await hotelRepo.findOne(hotelId);
    return this.productRepository.find({ hotel });
  }

  async updateProduct(product: ProductEntity) {
    const newProduct = { ...product };
    delete newProduct.id;
    return this.productRepository.update({ id: product.id }, newProduct);
  }

  getProduct(productId: number) {
    return this.productRepository.findOne({ id: productId });
  }
}
