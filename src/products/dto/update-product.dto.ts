import { PartialType } from '@nestjs/mapped-types';
import { IsPositive } from 'class-validator';

import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsPositive()
  public id: number;
}
