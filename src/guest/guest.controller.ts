import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { GuestService } from '../core/services/guest/guest.service';
import { GuestRequest } from '../core/models/guest-request';
import { GuestEntity } from '../core/entity';
import { WakeUpService } from '../core/services/wake-up/wake-up.service';
import { ReservationService } from '../core/services/reservation/reservation.service';

@Controller('guest')
export class GuestController {
  constructor(
    private guestService: GuestService,
    private wakeService: WakeUpService,
    private reservationService: ReservationService,
  ) {}

  @Post()
  createGuest(@Body() request: GuestRequest) {
    return this.guestService.createGuest(request);
  }

  @Put()
  updateGuest(@Body() request: GuestEntity) {
    return this.guestService.updateGuest(request);
  }

  @Delete(':id')
  deleteGuest(@Param('id') id: string) {
    return this.guestService.disableGuest(id);
  }

  @Get(':id')
  getGuest(@Param('id') id: string) {
    return this.guestService.getGuest(id);
  }

  @Get(':id/request')
  getGuestRequest(@Param('id') id: string, @Query('complete') complete: string) {
    return this.guestService.getRequest(id, complete === 't');
  }

  @Get(':id/wake-up')
  getWakeUp(@Param('id') id: string) {
    return this.wakeService.getWakeByGuest(id);
  }

  @Get(':id/reservation')
  getReservation(@Param('id') id: string) {
    return this.reservationService.getBookingByGuest(id);
  }
}
