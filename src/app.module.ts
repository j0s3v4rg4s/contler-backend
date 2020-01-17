import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelModule } from './hotel/hotel.module';
import { EmployerModule } from './employer/employer.module';
import { RoomModule } from './room/room.module';
import { GuestModule } from './guest/guest.module';
import { WakeUpModule } from './wake-up/wake-up.module';
import { RequestModule } from './request/request.module';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB,
      extra: {
        ssl: true,
      },
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      // logging: true,
    }),
    HotelModule,
    EmployerModule,
    RoomModule,
    GuestModule,
    WakeUpModule,
    RequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
