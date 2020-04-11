import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ProductService } from '../core/services/product/product.service';
import { ProductRequest } from '../core/models/product-request';
import { ProductEntity } from '../core/entity';
import { OrderRequest } from '../core/models/order-request';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  createProduct(@Body() request: ProductRequest) {
    return this.productService.create(request);
  }

  @Post(':id')
  updateProduct(@Body() request: ProductEntity) {
    return this.productService.updateProduct(request);
  }

  @Get(':id')
  getProduct(@Param('id') id: number) {
    return this.productService.getProduct(id);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: number) {
    return this.productService.deleteProduct(id);
  }

  @Post('order')
  createOrder(@Body() request: OrderRequest) {
    return this.productService.createOrder(request);
  }

  @Get('order/:id')
  getOrder(@Param('id') id: number) {
    return this.productService.getOrder(id);
  }
}
