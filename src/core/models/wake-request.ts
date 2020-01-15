import { HotelEntity, RoomEntity } from '../entity';
import { GuestEntity } from '../entity/guest.entity';
import { IsNotEmpty } from 'class-validator';

export class WakeRequest {
  @IsNotEmpty()
  date!: Date;

  @IsNotEmpty()
  time!: Date;

  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  hotel!: HotelEntity;

  @IsNotEmpty()
  room!: RoomEntity;

  @IsNotEmpty()
  guest!: GuestEntity;
}
