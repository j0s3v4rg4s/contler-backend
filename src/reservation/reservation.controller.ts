import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ReservationRequest } from '../core/models/reservation-request';
import { ReservationService } from '../core/services/reservation/reservation.service';
import { ScheduleEntity, ZoneReserveEntity } from '../core/entity';

@Controller('reservation')
export class ReservationController {
  constructor(private reservationsService: ReservationService) {}

  @Post()
  create(@Body() request: ReservationRequest) {
    return this.reservationsService.create(request);
  }

  @Get(':id')
  getReservation(@Param('id') id: number) {
    return this.reservationsService.getReservation(id);
  }

  @Delete(':id')
  deleteReservation(@Param('id') id: number) {
    return this.reservationsService.deleteReservation(id);
  }

  @Post(':id')
  updateReservation(@Param('id') id: number, @Body() reservation: ZoneReserveEntity) {
    return this.reservationsService.updateReservation(reservation);
  }

  @Post(':id/schedule')
  createSchedule(@Param('id') id: number, @Body() reservation: ScheduleEntity) {
    return this.reservationsService.saveSchedule(id, reservation);
  }

  @Delete('schedule/:id')
  deleteSchedule(@Param('id') id: number) {
    return this.reservationsService.deleteSchedule(id);
  }

  @Put('schedule/:id')
  updateSchedule(@Param('id') id: number,  @Body() schedule: ScheduleEntity) {
    return this.reservationsService.updateSchedule(schedule);
  }
}
