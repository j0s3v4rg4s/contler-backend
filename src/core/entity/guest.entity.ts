import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { HotelEntity } from './hotel.entity';
import { RoomEntity } from './room.entity';

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
}
