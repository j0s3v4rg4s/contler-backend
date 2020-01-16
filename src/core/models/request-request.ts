import { GuestEntity, HotelEntity, RoomEntity, ZoneEntity } from '../entity';
import { IsNotEmpty } from 'class-validator';

export class RequestRequest {
  @IsNotEmpty()
  message!: string;

  @IsNotEmpty()
  special!: boolean;

  @IsNotEmpty()
  zone!: ZoneEntity;

  @IsNotEmpty()
  room!: RoomEntity;

  @IsNotEmpty()
  guest!: GuestEntity;

  @IsNotEmpty()
  hotel!: HotelEntity;
}
