import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GuestEntity } from './guest.entity';
import { ScheduleEntity } from './schedule.entity';
import { HotelEntity } from './hotel.entity';

@Entity('booking')
export class BookingEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  date!: Date;

  @Column()
  quote!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ default: true })
  active!: boolean;

  @Column({ default: false })
  complete!: boolean;

  @ManyToOne(() => GuestEntity, guest => guest.booking)
  guest!: GuestEntity;

  @ManyToOne(() => ScheduleEntity, schedule => schedule.booking)
  schedule!: ScheduleEntity;

  @ManyToOne(() => HotelEntity, hotel => hotel.booking)
  hotel: HotelEntity;
}
