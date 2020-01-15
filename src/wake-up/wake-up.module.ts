import { Module } from '@nestjs/common';
import { WakeUpController } from './wake-up.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../core/entity';
import { WakeUpService } from '../core/services/wake-up/wake-up.service';
import { HotelService } from '../core/services/hotel/hotel.service';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [WakeUpController],
  providers: [WakeUpService, HotelService],
})
export class WakeUpModule {}
