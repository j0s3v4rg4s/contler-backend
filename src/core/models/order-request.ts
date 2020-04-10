import { IsNotEmpty } from 'class-validator';
import { GuestEntity, HotelEntity, ZoneEntity } from '../entity';
import { ProductListModel } from './product-list-model';

export class OrderRequest {
  @IsNotEmpty()
  hotel!: HotelEntity;

  @IsNotEmpty()
  zone!: ZoneEntity;

  comment!: string;

  @IsNotEmpty()
  time!: string;

  @IsNotEmpty()
  productList!: ProductListModel[];

  @IsNotEmpty()
  guest!: GuestEntity;
}
