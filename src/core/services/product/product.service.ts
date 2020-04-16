import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GuestEntity, HotelEntity, OrderEntity, ProductEntity, ProductOrderEntity } from '../../entity';
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

  async deleteProduct(productId: number) {
    const orders = await getConnection()
      .createQueryBuilder(OrderEntity, 'order')
      .innerJoin('order.productsOrder', 'prod', 'prod.order.id = order.id')
      .where('prod.id = :productId', { productId })
      .getMany();
    if (orders.length) {
      throw new HttpException('No se puede eliminar el producto', HttpStatus.BAD_REQUEST);
    }
    return this.productRepository.delete(productId);
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
    order.guest = request.guest;
    return this.orderEntityRepository.save(order);
  }

  async getOrderByGuest(idGuest: string) {
    const guestRepository = getConnection().getRepository(GuestEntity);
    const guest = await guestRepository.findOne(idGuest);
    return this.orderEntityRepository.find({ where: { guest }, relations: ['productsOrder', 'productsOrder.product'] });
  }

  getOrder(orderID: number) {
    return this.orderEntityRepository.findOne(orderID, {
      relations: ['productsOrder', 'productsOrder.product', 'zone', 'guest', 'guest.room', 'employer'],
    });
  }

  async getOrderByHotel(hotelId: string) {
    const hotelRepository = getConnection().getRepository(HotelEntity);
    const hotel = await hotelRepository.findOne(hotelId);
    return this.orderEntityRepository.find({
      where: { hotel },
      relations: ['productsOrder', 'productsOrder.product', 'guest', 'zone', 'guest.room', 'employer'],
    });
  }

  updateOrder(order: OrderEntity) {
    const newOrder = { ...order };
    delete newOrder.id;
    delete newOrder.productsOrder;
    return this.orderEntityRepository.update(order.id, newOrder);
  }

  deleteOrder(orderId: number) {
    return this.orderEntityRepository.delete(orderId);
  }
}
