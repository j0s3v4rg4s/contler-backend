import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from '../../entity';
import { HotelService } from '../hotel/hotel.service';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity) private roomRepository: Repository<RoomEntity>,
    private hotelService: HotelService,
  ) {}

  async createRoom(name: string, hotelId: string) {
    const hotel = await this.hotelService.getHotel(hotelId);
    const room = this.roomRepository.create();
    room.name = name;
    room.hotel = hotel;
    return this.roomRepository.save(room);
  }

  updateRoom(room: RoomEntity) {
    return this.roomRepository.save(room);
  }

  deleteRoom(id: string) {
    return this.roomRepository.delete({ uid: id });
  }

  async getRooms(hotelId: string) {
    const hotel = await this.hotelService.getHotel(hotelId);
    return this.roomRepository.find({ where: { hotel }, relations: ['guest'] });
  }

  getRoom(roomId: string) {
    return this.roomRepository.findOne({ uid: roomId });
  }
}
