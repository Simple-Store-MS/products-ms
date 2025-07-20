import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';

import { PrismaClient } from '../../generated/prisma';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Pagination } from '../common/dto/pagination.dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database CONNECTED');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(input: Pagination) {
    const { limit = 10, page = 0 } = input;
    const skip = (page - 1) * limit;

    const totalCount = await this.product.count({ where: { available: true } });

    const lastPage = Math.ceil(totalCount / limit);

    const data = await this.product.findMany({
      skip,
      take: limit,
      where: { available: true },
    });

    return {
      metadata: { totalCount, page, lastPage },
      data,
    };
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({
      where: { id, available: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found.`);
    }

    return product;
  }

  async update(input: UpdateProductDto) {
    const { id, ...updateProductDto } = input;

    await this.findOne(id);

    return this.product.update({
      data: updateProductDto,
      where: { id },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return await this.product.update({
      where: { id },
      data: { available: false },
    });
  }
}
