import { Module } from '@nestjs/common';
import { EmployerController } from './employer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../core/entity';
import { HotelService } from '../core/services/hotel/hotel.service';
import { EmployerService } from '../core/services/employer/employer.service';
import { UserService } from '../core/services/user/user.service';
import { RoomService } from '../core/services/room/room.service';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [EmployerController],
  providers: [HotelService, EmployerService, RoomService, UserService],
})
export class EmployerModule {}
