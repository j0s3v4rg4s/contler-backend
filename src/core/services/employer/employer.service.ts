import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployerEntity } from '../../entity';
import { Repository } from 'typeorm';
import { AdminRequest } from '../../models/admin-request';
import { ADMIN, Roles } from '../../const/roles';
import { EmployerRequest } from '../../models/employer-request';
import { auth } from 'firebase-admin';
import { HotelService } from '../hotel/hotel.service';
import { UserService } from '../user/user.service';

@Injectable()
export class EmployerService {
  constructor(
    @InjectRepository(EmployerEntity) private employerRepository: Repository<EmployerEntity>,
    private hotelService: HotelService,
    private userService: UserService,
  ) {}

  async createAdmin(request: AdminRequest) {
    const [hotel, user] = await Promise.all([
      this.hotelService.createHotel(request.hotelName, request.hotelLogo),
      this.userService.createUSer(request.email, request.password, request.name, ADMIN),
    ]);
    const employer = this.generateEmployer(user, hotel, ADMIN);
    return this.employerRepository.save(employer);
  }

  async createEmployer(request: EmployerRequest) {
    const [user, hotel] = await Promise.all([
      this.userService.createUSer(request.email, request.password, request.name, request.rol),
      this.hotelService.getHotel(request.idHotel),
    ]);
    const employer = this.generateEmployer(user, hotel, request.rol);
    employer.lastName = request.lastName;
    employer.leaderZones = await this.hotelService.getZonesByIds(Object.keys(request.leaderZone));
    return this.employerRepository.save(employer);
  }

  getEmployer(uid: string) {
    return this.employerRepository.findOne({ uid }, { relations: ['hotel'] });
  }

  async getEmployees(idHotel: string) {
    const hotel = await this.hotelService.getHotel(idHotel);
    return this.employerRepository.find({ where: { hotel, active: true }, relations: ['leaderZones'] });
  }

  updateEmployer(employer: EmployerEntity) {
    return this.employerRepository.save(employer);
  }

  removeEmployer(uid: string) {
    auth().updateUser(uid, { disabled: true });
    return this.employerRepository.update({ uid }, { active: false });
  }

  private generateEmployer(user, hotel, role: Roles) {
    const employer = this.employerRepository.create();
    employer.uid = user.uid;
    employer.hotel = hotel;
    employer.name = user.displayName;
    employer.role = role;
    employer.lastName = '';
    return employer;
  }
}
