import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RequestService } from '../core/services/request/request.service';
import { RequestRequest } from '../core/models/request-request';

@Controller('request')
export class RequestController {
  constructor(private requestService: RequestService) {}

  @Get(':id')
  getRequest(@Param('id') id: number) {
    return this.requestService.getRequest(id);
  }

  @Post()
  create(@Body() request: RequestRequest) {
    return this.requestService.create(request);
  }
}
