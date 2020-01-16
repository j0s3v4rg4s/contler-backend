import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../core/entity';
import { RequestService } from '../core/services/request/request.service';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}
