import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WakeUpEntity } from '../../entity';
import { WakeRequest } from '../../models/wake-request';
import { HotelService } from '../hotel/hotel.service';
import { GuestService } from '../guest/guest.service';

@Injectable()
export class WakeUpService {
  constructor(
    @InjectRepository(WakeUpEntity) private wakeUpRepository: Repository<WakeUpEntity>,
    private hotelService: HotelService,
    private guestService: GuestService,
  ) {}

  create(request: WakeRequest) {
    const wake = this.wakeUpRepository.create();
    const totalTime = new Date(request.date);
    const time = new Date(request.time);
    totalTime.setHours(time.getHours());
    totalTime.setMinutes(time.getMinutes());
    totalTime.setSeconds(time.getMinutes());
    totalTime.setMilliseconds(time.getMilliseconds());

    wake.guest = request.guest;
    wake.room = request.room;
    wake.date = request.date;
    wake.hotel = request.hotel;
    wake.name = request.name;
    wake.time = request.time;
    wake.competeDate = totalTime;
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

  async getWakeByHotel(id: string, complete?: boolean) {
    const hotel = await this.hotelService.getHotel(id);
    if (complete !== null) {
      return this.wakeUpRepository.find({
        where: { hotel, complete },
        relations: ['room', 'guest'],
        order: { competeDate: 'ASC' },
      });
    } else {
      return this.wakeUpRepository.find({
        where: { hotel },
        relations: ['room', 'guest'],
        order: { competeDate: 'ASC' },
      });
    }
  }

  async getWakeByGuest(id: string) {
    const guest = await this.guestService.getGuest(id);
    return this.wakeUpRepository.find({ where: { guest }, relations: ['room', 'guest'], order: {competeDate: 'ASC'} });
  }

  completeWake(id: number) {
    return this.wakeUpRepository.update({ id }, { complete: true });
  }
}
