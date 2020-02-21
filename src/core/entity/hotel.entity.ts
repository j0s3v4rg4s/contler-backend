import { Column, Entity, Generated, OneToMany, PrimaryColumn } from 'typeorm';
import { EmployerEntity } from './employer.entity';
import { ZoneEntity } from './zone.entity';
import { RoomEntity } from './room.entity';
import { GuestEntity } from './guest.entity';
import { WakeUpEntity } from './wake-up.entity';
import { RequestEntity } from './request.entity';
import { ZoneReserveEntity } from './zone-reserve.entity';
import { BookingEntity } from './booking.entity';

@Entity({ name: 'hotel' })
export class HotelEntity {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  uid!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  color!: string;

  @Column({ nullable: true })
  colorSecond!: string;

  @Column()
  logo!: string;

  @OneToMany(() => EmployerEntity, employer => employer.hotel)
  employees!: EmployerEntity[];

  @OneToMany(() => ZoneEntity, zone => zone.hotel)
  zones!: ZoneEntity[];

  @OneToMany(() => ZoneReserveEntity, reservation => reservation.hotel)
  zonesReservation!: ZoneReserveEntity[];

  @OneToMany(() => RoomEntity, room => room.hotel)
  rooms!: RoomEntity[];

  @OneToMany(() => GuestEntity, guest => guest.hotel)
  guests!: GuestEntity[];

  @OneToMany(() => WakeUpEntity, wakeUp => wakeUp.hotel)
  wakeUps!: WakeUpEntity[];

  @OneToMany(() => RequestEntity, request => request.hotel)
  request!: RequestEntity[];

  @OneToMany(() => BookingEntity, booking => booking.hotel)
  booking!: BookingEntity[];
}
