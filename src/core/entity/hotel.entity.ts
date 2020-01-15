import { Column, Entity, Generated, OneToMany, PrimaryColumn } from 'typeorm';
import { EmployerEntity } from './employer.entity';
import { ZoneEntity } from './zone.entity';
import { RoomEntity } from './room.entity';
import { GuestEntity } from './guest.entity';

@Entity({ name: 'hotel' })
export class HotelEntity {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  uid!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  color!: string;

  @Column()
  logo!: string;

  @OneToMany(() => EmployerEntity, employer => employer.hotel)
  employees!: EmployerEntity[];

  @OneToMany(() => ZoneEntity, zone => zone.hotel)
  zones!: ZoneEntity[];

  @OneToMany(() => RoomEntity, room => room.hotel)
  rooms!: RoomEntity[];

  @OneToMany(() => GuestEntity, guest => guest.hotel)
  guests!: GuestEntity[];
}
