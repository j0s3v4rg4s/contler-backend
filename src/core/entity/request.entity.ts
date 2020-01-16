import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EmployerEntity } from './employer.entity';
import { ZoneEntity } from './zone.entity';
import { RoomEntity } from './room.entity';
import { GuestEntity } from './guest.entity';
import { HotelEntity } from './hotel.entity';

@Entity('request')
export class RequestEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  message!: string;

  @Column()
  createAt!: Date;

  @Column({nullable: true})
  finishAt!: Date;

  @Column({nullable: true})
  score!: number;

  @Column({nullable: true})
  comment!: string;

  @Column()
  special!: boolean;

  @Column({ default: false })
  complete!: boolean;

  @ManyToOne(() => EmployerEntity, employer => employer.requestAttended)
  attended!: EmployerEntity;

  @ManyToOne(() => EmployerEntity, employer => employer.requestSolved)
  solved!: EmployerEntity;

  @ManyToOne(() => ZoneEntity, zone => zone.request)
  zone!: ZoneEntity;

  @ManyToOne(() => RoomEntity, room => room.request)
  room!: RoomEntity;

  @ManyToOne(() => GuestEntity, guest => guest.request)
  guest!: GuestEntity;

  @ManyToOne(() => HotelEntity, hotel => hotel.request)
  hotel!: HotelEntity;
}
