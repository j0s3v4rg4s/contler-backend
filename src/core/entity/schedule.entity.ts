import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ZoneReserveEntity } from './zone-reserve.entity';

@Entity('schedule')
export class ScheduleEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  day!: string;

  @Column({ name: 'time_init' })
  timeInit!: Date;

  @Column({ name: 'time_finish' })
  timeFinish!: Date;

  @Column()
  quota!: number;

  @Column()
  active!: boolean;

  @ManyToOne(() => ZoneReserveEntity, zone => zone.schedule)
  reservation: ZoneReserveEntity;
}
