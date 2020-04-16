import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductOrderEntity } from './product-order.entity';
import { HotelEntity } from './hotel.entity';
import { GuestEntity } from './guest.entity';
import { ZoneEntity } from './zone.entity';
import { EmployerEntity } from './employer.entity';

@Entity({ name: 'order' })
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(() => ProductOrderEntity, productOrder => productOrder.order)
  productsOrder!: ProductOrderEntity[];

  @ManyToOne(() => HotelEntity, hotel => hotel.orders)
  hotel!: HotelEntity;

  @ManyToOne(() => GuestEntity, guest => guest.orders)
  guest!: GuestEntity;

  @ManyToOne(() => ZoneEntity, zone => zone.orders)
  zone!: ZoneEntity;

  @ManyToOne(() => EmployerEntity, employer => employer.order)
  employer: EmployerEntity;

  @Column({ nullable: true })
  comment!: string;

  @Column()
  time!: Date;

  @Column({ default: 0 })
  state: number;

  @Column({nullable: true})
  qualification: number;

  @Column({nullable: true})
  dateComplete: Date;
}
