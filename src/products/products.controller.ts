import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Pagination } from '../common/dto/pagination.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern('CREATE_PRODUCT')
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @MessagePattern('FIND_PRODUCTS')
  findAll(@Payload() input: Pagination) {
    return this.productsService.findAll(input);
  }

  @MessagePattern('FIND_PRODUCT')
  findOne(@Payload('id') id: number) {
    return this.productsService.findOne(id);
  }

  @MessagePattern('UPDATE_PRODUCT')
  update(@Payload() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto);
  }

  @MessagePattern('DELETE_PRODUCT')
  remove(@Payload('id') id: number) {
    return this.productsService.remove(id);
  }
}
