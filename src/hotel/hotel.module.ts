import { Module } from '@nestjs/common';
import { HotelController } from './hotel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../core/entity';
import { EmployerService } from '../core/services/employer/employer.service';
import { HotelService } from '../core/services/hotel/hotel.service';
import { UserService } from '../core/services/user/user.service';
import { RoomService } from '../core/services/room/room.service';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [HotelController],
  providers: [HotelService, EmployerService, RoomService, UserService],
})
export class HotelModule {}
