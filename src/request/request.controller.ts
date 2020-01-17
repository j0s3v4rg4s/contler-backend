import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { RequestService } from '../core/services/request/request.service';
import { RequestRequest } from '../core/models/request-request';
import { RequestEntity } from '../core/entity';

@Controller('request')
export class RequestController {
  constructor(private requestService: RequestService) {}

  @Get(':id')
  getRequest(@Param('id') id: number) {
    return this.requestService.getRequest(id);
  }

  @Post()
  createRequest(@Body() request: RequestRequest) {
    return this.requestService.create(request);
  }

  @Put()
  updateRequest(@Body() request: RequestEntity) {
    return this.requestService.update(request);
  }
}
