import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { PrismaClient } from '../../generated/prisma';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Pagination } from '../common/dto/pagination.dto';
import { RpcException } from '@nestjs/microservices';
import { ValidateProductsDto } from './dto/validate-products.dto';

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
    const { limit = 10, page = 1 } = input;
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
      throw new RpcException({
        message: `Product with id ${id} not found.`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    return product;
  }

  async remove(id: number) {
    await this.findOne(id);

    return await this.product.update({
      where: { id },
      data: { available: false },
    });
  }

  async update(input: UpdateProductDto) {
    const { id, ...updateProductDto } = input;

    await this.findOne(id);

    return this.product.update({
      data: updateProductDto,
      where: { id },
    });
  }

  async validateProducts(input: ValidateProductsDto) {
    const { ids, withDeleted = false } = input;
    const idsToFind = Array.from(new Set(ids));

    const products = await this.product.findMany({
      where: {
        id: { in: idsToFind },
        ...(!withDeleted && { available: true }),
      },
    });

    if (products.length !== ids.length) {
      this.logger.error({ idsToFind, withDeleted });
      throw new RpcException({
        message: 'Some products were not found.',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    return products;
  }
}
