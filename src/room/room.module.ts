import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../core/entity';
import { RoomService } from '../core/services/room/room.service';
import { HotelService } from '../core/services/hotel/hotel.service';
import { EmployerService } from '../core/services/employer/employer.service';
import { UserService } from '../core/services/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [HotelService, EmployerService, RoomService, UserService],
  controllers: [RoomController],
})
export class RoomModule {}
