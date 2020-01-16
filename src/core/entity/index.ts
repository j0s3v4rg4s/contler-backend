import { HotelEntity } from './hotel.entity';
import { EmployerEntity } from './employer.entity';
import { ZoneEntity } from './zone.entity';
import { CategoryEntity } from './category.entity';
import { RoomEntity } from './room.entity';
import { GuestEntity } from './guest.entity';
import { WakeUpEntity } from './wake-up.entity';
import { RequestEntity } from './request.entity';

export * from './hotel.entity';
export * from './employer.entity';
export * from './zone.entity';
export * from './room.entity';
export * from './wake-up.entity';
export * from './request.entity';
export * from './guest.entity';

export const entities = [
  HotelEntity,
  EmployerEntity,
  ZoneEntity,
  CategoryEntity,
  RoomEntity,
  GuestEntity,
  WakeUpEntity,
  RequestEntity,
];
