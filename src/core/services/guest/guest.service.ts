import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GuestEntity } from '../../entity/guest.entity';
import { Repository } from 'typeorm';
import { GuestRequest } from '../../models/guest-request';
import { UserService } from '../user/user.service';
import { GUEST } from '../../const/roles';

@Injectable()
export class GuestService {
  constructor(
    @InjectRepository(GuestEntity) private guestRepository: Repository<GuestEntity>,
    private userService: UserService,
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
    return this.guestRepository.save(request);
  }
}
