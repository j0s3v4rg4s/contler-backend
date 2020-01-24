import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GuestEntity } from '../../entity/guest.entity';
import { getConnection, Repository } from 'typeorm';
import { GuestRequest } from '../../models/guest-request';
import { UserService } from '../user/user.service';
import { GUEST } from '../../const/roles';
import { HotelService } from '../hotel/hotel.service';
import { RequestEntity } from '../../entity';

@Injectable()
export class GuestService {
  constructor(
    @InjectRepository(GuestEntity) private guestRepository: Repository<GuestEntity>,
    private userService: UserService,
    private hotelService: HotelService,
  ) {}

  async createGuest(request: GuestRequest) {
    const guest = this.guestRepository.create();
    const user = await this.userService.createUSer(request.email, request.document, request.name, GUEST);
    guest.uid = user.uid;
    guest.room = request.room;
    guest.checkIn = request.checkIn;
    guest.checkOut = request.checkOut;
    guest.document = request.document;
    guest.hotel = request.hotel;
    guest.lastName = request.lastName;
    guest.name = request.name;
    guest.typeDocument = request.typeDocument;
    return this.guestRepository.save(guest);
  }

  updateGuest(guest: GuestEntity) {
    return this.guestRepository.save(guest);
  }

  async disableGuest(id: string) {
    this.userService.disableUser(id);
    const guest = await this.guestRepository.findOne({ uid: id });
    guest.active = false;
    guest.hotel = null;
    guest.room = null;
    return this.guestRepository.save(guest);
  }

  getGuest(id: string) {
    return this.guestRepository.findOne({ where: { uid: id }, relations: ['hotel', 'hotel.zones', 'room'] });
  }

  async getRequest(id: string, complete: boolean) {
    const guest = await this.guestRepository.findOne(id);
    return getConnection()
      .getRepository(RequestEntity)
      .find({ where: {guest, complete, special: false}, relations: ['zone'] } );
  }

  async getGuestByHotel(idHotel) {
    const hotel = await this.hotelService.getHotel(idHotel);
    return this.guestRepository.find({ where: { hotel }, relations: ['room'] });
  }
}
