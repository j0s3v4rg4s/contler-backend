import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { HotelEntity } from './hotel.entity';
import { ZoneEntity } from './zone.entity';
import { RequestEntity } from './request.entity';

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

  @Column({ default: 0 , type: 'decimal'})
  averageScore!: number;

  @Column({ default: 0 })
  totalServices!: number;

  @Column({ default: 0 , type: 'decimal'})
  averageTime!: number;

  @Column({ default: 0, type: 'numeric' })
  totalTime!: number;

  @Column({ default: true })
  active!: boolean;

  @Column({ nullable: true })
  pushToken!: string;

  @ManyToOne(() => HotelEntity, hotel => hotel.employees)
  hotel!: HotelEntity;

  @ManyToMany(() => ZoneEntity, zone => zone.leaders)
  @JoinTable({ name: 'leaders' })
  leaderZones!: ZoneEntity[];

  @OneToMany(() => RequestEntity, request => request.attended)
  requestAttended!: RequestEntity[];

  @OneToMany(() => RequestEntity, request => request.solved)
  requestSolved!: RequestEntity[];
}
