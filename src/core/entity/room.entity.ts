import { Column, Entity, Generated, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { HotelEntity } from './hotel.entity';
import { GuestEntity } from './guest.entity';
import { WakeUpEntity } from './wake-up.entity';

@Entity('room')
export class RoomEntity {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  uid!: string;

  @Column()
  name!: string;

  @ManyToOne(() => HotelEntity, hotel => hotel.rooms)
  hotel!: HotelEntity;

  @OneToOne(() => GuestEntity, guest => guest.room)
  guest: GuestEntity;

  @OneToMany(() => WakeUpEntity, wakeUp => wakeUp.room)
  wakeUps!: WakeUpEntity[];
}
