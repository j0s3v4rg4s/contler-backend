import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { HotelEntity } from './hotel.entity';
import { CategoryEntity } from './category.entity';
import { ScheduleEntity } from './schedule.entity';

@Entity('zone-reservation')
export class ZoneReserveEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  icon!: string;

  @ManyToOne(() => HotelEntity, hotel => hotel.zonesReservation)
  hotel!: HotelEntity;

  @ManyToOne(() => CategoryEntity, category => category.zonesReservation)
  category!: CategoryEntity;

  @OneToMany(() => ScheduleEntity, schedule => schedule.reservation)
  schedule: ScheduleEntity[];
}
