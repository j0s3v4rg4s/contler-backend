import { Module } from '@nestjs/common';
import { HotelController } from './hotel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../core/entity';
import { EmployerService } from '../core/services/employer/employer.service';
import { HotelService } from '../core/services/hotel/hotel.service';
import { UserService } from '../core/services/user/user.service';
import { RoomService } from '../core/services/room/room.service';
import { GuestService } from '../core/services/guest/guest.service';
import { WakeUpService } from '../core/services/wake-up/wake-up.service';
import { RequestService } from '../core/services/request/request.service';
import { ReservationService } from '../core/services/reservation/reservation.service';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [HotelController],
  providers: [HotelService, EmployerService, RoomService, UserService, GuestService, WakeUpService, RequestService, ReservationService],
})
export class HotelModule {}
