import { IsNotEmpty } from 'class-validator';

export class ProductRequest {
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  value!: number;

  @IsNotEmpty()
  description!: string;

  @IsNotEmpty()
  category!: string;

  @IsNotEmpty()
  hotelId!: string;
}
