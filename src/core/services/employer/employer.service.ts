import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployerEntity, RequestEntity, ZoneEntity } from '../../entity';
import { getConnection, MoreThanOrEqual, Repository } from 'typeorm';
import { AdminRequest } from '../../models/admin-request';
import { ADMIN, Roles } from '../../const/roles';
import { EmployerRequest } from '../../models/employer-request';
import { auth } from 'firebase-admin';
import { HotelService } from '../hotel/hotel.service';
import { UserService } from '../user/user.service';
import { DAY_TIME } from '../../const/times';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';

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
    return this.employerRepository.findOne({ uid }, { relations: ['hotel', 'leaderZones'] });
  }

  async getEmployees(idHotel: string) {
    const hotel = await this.hotelService.getHotel(idHotel);
    return this.employerRepository.find({ where: { hotel, active: true }, relations: ['leaderZones'] });
  }

  updateEmployer(employer: EmployerEntity) {
    delete employer.averageTime;
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

  async getLeaderRequests(idEmployer: string, complete: boolean, time?: number) {
    let query = getConnection()
      .createQueryBuilder(RequestEntity, 'req')
      .leftJoinAndSelect('req.guest', 'guest')
      .leftJoinAndSelect('req.zone', 'zone')
      .leftJoinAndSelect('req.room', 'room')
      .leftJoinAndSelect('req.solved', 'solved')
      .innerJoin('req.zone', 'zonet')
      .innerJoin('zonet.leaders', 'leader', 'leader.uid = :id', { id: idEmployer })
      .where('req.complete = :complete', { complete })
      .andWhere('req.public = false');

    if (time > 0) {
      const date = new Date(Date.now() - DAY_TIME * time);
      query = query.andWhere('req.createAt >= :date', { date });
    }

    return query.orderBy('req.createAt', 'DESC').getMany();
  }

  async getPublicRequest(idEmployer: string, complete: boolean, time?: number) {
    const employerEntity = await this.employerRepository.findOne({ uid: idEmployer }, { relations: ['hotel'] });
    const reqRepository = getConnection().getRepository(RequestEntity);

    const optSearch: any = {
      where: { complete, public: true, hotel: employerEntity.hotel },
      relations: ['guest', 'zone', 'room', 'solved'],
    };

    if (time > 0) {
      const date = new Date(Date.now() - DAY_TIME * time);
      optSearch.where = { ...optSearch.where, createAt: MoreThanOrEqual(date) };
    }

    return reqRepository.find(optSearch);
  }
}
