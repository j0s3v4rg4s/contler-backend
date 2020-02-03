import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../core/entity';
import { ReservationService } from '../core/services/reservation/reservation.service';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [ReservationService],
  controllers: [ReservationController],
})
export class ReservationModule {}
