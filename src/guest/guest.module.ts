import { Module } from '@nestjs/common';
import { GuestController } from './guest.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../core/entity';
import { GuestService } from '../core/services/guest/guest.service';
import { UserService } from '../core/services/user/user.service';
import { HotelService } from '../core/services/hotel/hotel.service';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [GuestController],
  providers: [GuestService, UserService, HotelService],
})
export class GuestModule {}
