import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HotelEntity, OrderEntity, ProductEntity, ProductOrderEntity } from '../../entity';
import { getConnection, Repository } from 'typeorm';
import { ProductRequest } from '../../models/product-request';
import { OrderRequest } from '../../models/order-request';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductOrderEntity) private productOrderRepository: Repository<ProductOrderEntity>,
    @InjectRepository(OrderEntity) private orderEntityRepository: Repository<OrderEntity>,
  ) {}

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

  async createOrder(request: OrderRequest) {
    const productList = await Promise.all(
      request.productList.map(async prod => {
        const productOrder = this.productOrderRepository.create();
        productOrder.product = prod.product;
        productOrder.quantity = prod.quantity;
        await this.productOrderRepository.save(productOrder);
        return productOrder;
      }),
    );
    const order = this.orderEntityRepository.create();
    order.productsOrder = productList;
    order.hotel = request.hotel;
    order.zone = request.zone;
    order.comment = request.comment;
    order.time = new Date(request.time);
    return this.orderEntityRepository.save(order);
  }
}
