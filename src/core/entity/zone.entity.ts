import { Column, Entity, Generated, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { HotelEntity } from './hotel.entity';
import { CategoryEntity } from './category.entity';
import { EmployerEntity } from './employer.entity';
import { RequestEntity } from './request.entity';
import { OrderEntity } from './order.entity';

@Entity('zone')
export class ZoneEntity {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  uid!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  icon!: string;

  @Column()
  principal!: boolean;

  @ManyToOne(() => HotelEntity, hotel => hotel.zones)
  hotel!: HotelEntity;

  @ManyToOne(() => CategoryEntity, category => category.zones)
  category!: CategoryEntity;

  @ManyToMany(() => EmployerEntity, employer => employer.leaderZones)
  leaders: EmployerEntity[];

  @OneToMany(() => RequestEntity, request => request.zone)
  request!: RequestEntity[];

  @OneToMany(() => OrderEntity, order => order.zone)
  orders!: OrderEntity[];
}
