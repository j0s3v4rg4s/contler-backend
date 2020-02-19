import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ReservationRequest } from '../../models/reservation-request';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingEntity, GuestEntity, HotelEntity, ScheduleEntity, ZoneReserveEntity } from '../../entity';
import { getConnection, Repository } from 'typeorm';
import { BookingRequest } from '../../models/booking-request';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(ZoneReserveEntity) private reservationRepository: Repository<ZoneReserveEntity>,
    @InjectRepository(ScheduleEntity) private scheduleRepository: Repository<ScheduleEntity>,
    @InjectRepository(BookingEntity) private bookingRepository: Repository<BookingEntity>,
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

  saveBooking(idSchedule: number, request: BookingRequest) {
    return getConnection().transaction('READ UNCOMMITTED', async entityManager => {
      const schedule = await entityManager.findOne(ScheduleEntity, idSchedule);
      const { total } = await entityManager
        .createQueryBuilder(BookingEntity, 'booking')
        .select('sum(quote)', 'total')
        .where('booking."scheduleId" = :id', { id: idSchedule })
        .andWhere('booking.active = true')
        .getRawOne();
      const actualQuota = Number(total !== null ? total : 0) + Number(request.quote);
      if (actualQuota <= schedule.quota) {
        const booking = entityManager.create(BookingEntity);
        booking.schedule = schedule;
        booking.guest = request.guest;
        booking.active = true;
        booking.date = request.date;
        booking.description = request.description;
        booking.name = request.name;
        booking.quote = request.quote;
        return entityManager.save(booking);
      } else {
        throw new HttpException('No hay cupos disponibles', HttpStatus.BAD_REQUEST);
      }
    });
  }

  updateBooking(booking: BookingEntity) {
    return getConnection().transaction('READ UNCOMMITTED', async entityManager => {
      const { total } = await entityManager
        .createQueryBuilder(BookingEntity, 'booking')
        .select('sum(quote)', 'total')
        .where('booking."scheduleId" = :id', { id: booking.schedule.id })
        .andWhere('booking.active = true')
        .andWhere('booking.id = :id', { id: booking.id })
        .getRawOne();
      const actualQuota = Number(total !== null ? total : 0) + Number(booking.quote);
      if (actualQuota <= booking.schedule.quota) {
        await entityManager.save(plainToClass(BookingEntity, booking));
      } else {
        throw new HttpException('No hay cupos disponibles', HttpStatus.BAD_REQUEST);
      }
    });
  }

  async getBookingByGuest(id: string) {
    const guest = await getConnection()
      .getRepository(GuestEntity)
      .findOne(id);
    return this.bookingRepository.find({ where: { guest }, relations: ['schedule', 'schedule.reservation'] });
  }

  getBooking(id: number) {
    return this.bookingRepository.findOne({
      where: { id },
      relations: ['schedule', 'schedule.reservation', 'schedule.reservation.schedule'],
    });
  }
}
