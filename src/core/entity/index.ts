import { HotelEntity } from './hotel.entity';
import { EmployerEntity } from './employer.entity';
import { ZoneEntity } from './zone.entity';
import { CategoryEntity } from './category.entity';
import { RoomEntity } from './room.entity';
import { GuestEntity } from './guest.entity';

export * from './hotel.entity';
export * from './employer.entity';
export * from './zone.entity';
export * from './room.entity';

export const entities = [HotelEntity, EmployerEntity, ZoneEntity, CategoryEntity, RoomEntity, GuestEntity];
