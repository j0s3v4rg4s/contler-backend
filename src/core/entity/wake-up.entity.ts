import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { HotelEntity } from './hotel.entity';
import { RoomEntity } from './room.entity';
import { GuestEntity } from './guest.entity';

@Entity('wakeUp')
export class WakeUpEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  date!: Date;

  @Column()
  time!: Date;

  @Column()
  name!: string;

  @ManyToOne(() => HotelEntity, hotel => hotel.wakeUps)
  hotel!: HotelEntity;

  @ManyToOne(() => RoomEntity, room => room.wakeUps)
  room!: RoomEntity;

  @ManyToOne(() => GuestEntity, guest => guest.wakeUps)
  guest!: GuestEntity;
}
