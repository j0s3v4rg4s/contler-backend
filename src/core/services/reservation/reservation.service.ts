import { Injectable } from '@nestjs/common';
import { ReservationRequest } from '../../models/reservation-request';
import { InjectRepository } from '@nestjs/typeorm';
import { HotelEntity, ScheduleEntity, ZoneReserveEntity } from '../../entity';
import { getConnection, Repository } from 'typeorm';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(ZoneReserveEntity) private reservationRepository: Repository<ZoneReserveEntity>,
    @InjectRepository(ScheduleEntity) private scheduleRepository: Repository<ScheduleEntity>,
  ) {}

  create(request: ReservationRequest) {
    const reservation = this.reservationRepository.create();
    reservation.name = request.name;
    reservation.icon = request.icon;
    reservation.category = request.category;
    reservation.hotel = request.hotel;
    return this.reservationRepository.save(reservation);
  }

  async getReservationsByHotel(idHotel: string) {
    const hotel = await getConnection()
      .getRepository(HotelEntity)
      .findOne(idHotel);
    return this.reservationRepository.find({ where: { hotel }, relations: ['schedule'] });
  }

  getReservation(id: number) {
    return this.reservationRepository.findOne(id, { relations: ['category', 'schedule'] });
  }

  updateReservation(reservation: ZoneReserveEntity) {
    return this.reservationRepository.save(reservation);
  }

  deleteReservation(id: number) {
    return this.reservationRepository.delete(id);
  }

  async saveSchedule(idReservation: number, scheduleRequest: ScheduleEntity) {
    const reservation = await this.reservationRepository.findOne(idReservation);
    const schedule = this.scheduleRepository.create();
    schedule.active = scheduleRequest.active;
    schedule.day = scheduleRequest.day;
    schedule.timeFinish = scheduleRequest.timeFinish;
    schedule.timeInit = scheduleRequest.timeInit;
    schedule.quota = scheduleRequest.quota;
    schedule.reservation = reservation;
    return this.scheduleRepository.save(schedule);
  }

  updateSchedule(scheduleRequest: ScheduleEntity) {
    return this.scheduleRepository.save(scheduleRequest);
  }

  deleteSchedule(id: number) {
    return this.scheduleRepository.delete(id);
  }
}
