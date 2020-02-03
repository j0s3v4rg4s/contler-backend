import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ZoneEntity } from './zone.entity';
import { ZoneReserveEntity } from './zone-reserve.entity';

@Entity({name: 'category'})
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToMany(() => ZoneEntity, zone => zone.category)
  zones!: ZoneEntity[];

  @OneToMany(() => ZoneReserveEntity, reservation => reservation.category)
  zonesReservation!: ZoneReserveEntity[];
}
