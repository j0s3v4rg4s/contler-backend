import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryColumn } from 'typeorm';
import { HotelEntity } from './hotel.entity';
import { ZoneEntity } from './zone.entity';

@Entity({ name: 'employer' })
export class EmployerEntity {
  @PrimaryColumn()
  uid!: string;

  @Column()
  name!: string;

  @Column()
  lastName!: string;

  @Column()
  role!: string;

  @Column({ default: 0 })
  totalScore!: number;

  @Column({ default: 0 })
  totalServices!: number;

  @Column({ default: 0, type: 'numeric' })
  totalTime!: number;

  @Column({default: true})
  active!: boolean;

  @ManyToOne(() => HotelEntity, hotel => hotel.employees)
  hotel!: HotelEntity;

  @ManyToMany(() => ZoneEntity, zone => zone.leaders)
  @JoinTable({ name: 'leaders' })
  leaderZones!: ZoneEntity[];
}
