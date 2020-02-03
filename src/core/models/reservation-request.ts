import { IsNotEmpty } from 'class-validator';
import { CategoryEntity } from '../entity/category.entity';
import { HotelEntity } from '../entity';

export class ReservationRequest {
  @IsNotEmpty()
  name!: string;

  icon!: string;

  @IsNotEmpty()
  category!: CategoryEntity;

  @IsNotEmpty()
  hotel!: HotelEntity;
}
