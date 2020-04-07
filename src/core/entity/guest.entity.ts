import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { HotelEntity } from './hotel.entity';
import { RoomEntity } from './room.entity';
import { WakeUpEntity } from './wake-up.entity';
import { RequestEntity } from './request.entity';
import { BookingEntity } from './booking.entity';
import { OrderEntity } from './order.entity';

@Entity('guest')
export class GuestEntity {
  @PrimaryColumn()
  uid!: string;

  @Column({ default: true })
  active!: boolean;

  @Column()
  name!: string;

  @Column()
  lastName!: string;

  @Column()
  typeDocument!: number;

  @Column()
  document!: string;

  @Column()
  checkIn!: Date;

  @Column()
  checkOut!: Date;

  @ManyToOne(() => HotelEntity, hotel => hotel.guests)
  hotel!: HotelEntity;

  @OneToOne(() => RoomEntity, room => room.guest)
  @JoinColumn()
  room!: RoomEntity;

  @OneToMany(() => WakeUpEntity, wakeUp => wakeUp.guest)
  wakeUps!: WakeUpEntity[];

  @OneToMany(() => RequestEntity, request => request.guest)
  request!: RequestEntity[];

  @OneToMany(() => BookingEntity, booking => booking.guest)
  booking!: BookingEntity[];

  @OneToMany(() => OrderEntity, order => order.guest)
  orders!: OrderEntity[];
}
