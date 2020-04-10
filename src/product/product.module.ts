import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity, ProductEntity, ProductOrderEntity } from '../core/entity';
import { ProductService } from '../core/services/product/product.service';

@Module({
  controllers: [ProductController],
  imports: [TypeOrmModule.forFeature([ProductEntity, OrderEntity, ProductOrderEntity])],
  providers: [ProductService],
})
export class ProductModule {}
