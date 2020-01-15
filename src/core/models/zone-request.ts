import { IsNotEmpty } from 'class-validator';
import { CategoryEntity } from '../entity/category.entity';

export class ZoneRequest {
  @IsNotEmpty()
  name: string;

  icon: string;

  @IsNotEmpty()
  principal: boolean;

  category: CategoryEntity;
}
