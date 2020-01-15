import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WakeUpEntity } from '../../entity';
import { WakeRequest } from '../../models/wake-request';
import { HotelService } from '../hotel/hotel.service';

@Injectable()
export class WakeUpService {
  constructor(
    @InjectRepository(WakeUpEntity) private wakeUpRepository: Repository<WakeUpEntity>,
    private hotelService: HotelService,
  ) {}

  create(request: WakeRequest) {
    const wake = this.wakeUpRepository.create();
    wake.guest = request.guest;
    wake.room = request.room;
    wake.date = request.date;
    wake.hotel = request.hotel;
    wake.name = request.name;
    wake.time = request.time;
    return this.wakeUpRepository.save(wake);
  }

  update(wake: WakeRequest) {
    return this.wakeUpRepository.save(wake);
  }

  delete(id: number) {
    return this.wakeUpRepository.delete({ id });
  }

  getWake(id: number) {
    return this.wakeUpRepository.findOne({ where: { id }, relations: ['room', 'guest'] });
  }

  async getWakeByHotel(id: string) {
    const hotel = await this.hotelService.getHotel(id);
    return this.wakeUpRepository.find({ where: { hotel }, relations: ['room', 'guest'] });
  }
}
