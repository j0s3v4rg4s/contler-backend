import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductService } from '../core/services/product/product.service';
import { ProductRequest } from '../core/models/product-request';
import { ProductEntity } from '../core/entity';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  createProduct(@Body() request: ProductRequest) {
    return this.productService.create(request);
  }

  @Post('id')
  updateProduct(@Body() request: ProductEntity) {
    return this.productService.updateProduct(request);
  }

  @Get('id')
  getProduct(@Param('id') id: number) {
    return this.productService.getProduct(id);
  }
}
