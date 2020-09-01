import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AdminRequest } from '../core/models/admin-request';
import { EmployerService } from '../core/services/employer/employer.service';
import { EmployerRequest } from '../core/models/employer-request';
import { EmployerEntity } from '../core/entity';

@Controller('employer')
export class EmployerController {
  constructor(private employerService: EmployerService) {}

  @Post()
  createEmployer(@Body() request: EmployerRequest) {
    return this.employerService.createEmployer(request);
  }
  @Put()
  updateEmployer(@Body() employer: EmployerEntity) {
    return this.employerService.updateEmployer(employer);
  }

  @Get(':id')
  getEmployer(@Param('id') id: string) {
    return this.employerService.getEmployer(id);
  }

  @Get(':id/request')
  async getRequestEmployer(@Param('id') id: string, @Query('complete') complete: string, @Query('time') time?: string) {
    const timeLast = !!time && Number(time) && Number(time) > 0 ? Number(time) : null;

    const publicReq = await this.employerService.getPublicRequest(id, complete === 't', timeLast);
    const zoneReq = await this.employerService.getLeaderRequests(id, complete === 't', timeLast);
    return [...publicReq, ...zoneReq].sort((a, b) => b.createAt.getTime() - a.createAt.getTime());
  }

  @Delete(':id')
  removeEmployer(@Param('id') id: string) {
    return this.employerService.removeEmployer(id);
  }

  @Post('admin')
  createAdmin(@Body() request: AdminRequest) {
    return this.employerService.createAdmin(request);
  }
}
