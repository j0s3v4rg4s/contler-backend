import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { WakeUpService } from '../core/services/wake-up/wake-up.service';
import { WakeRequest } from '../core/models/wake-request';
import { WakeUpEntity } from '../core/entity';

@Controller('wake-up')
export class WakeUpController {
  constructor(private wakeService: WakeUpService) {}

  @Post()
  createWake(@Body() request: WakeRequest) {
    return this.wakeService.create(request);
  }

  @Put()
  updateWake(@Body() request: WakeUpEntity) {
    return this.wakeService.update(request);
  }

  @Delete(':id')
  deleteWake(@Param('id') id: number) {
    return this.wakeService.delete(id);
  }

  @Get(':id')
  getWake(@Param('id') id: number) {
    return this.wakeService.getWake(id);
  }

  @Put('complete')
  completeWake(@Body('id') id: number) {
    return this.wakeService.completeWake(id);
  }
}
