import { Column, Entity, Generated, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { HotelEntity } from './hotel.entity';

@Entity({ name: 'product' })
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  value!: number;

  @Column({ default: true })
  state!: boolean;

  @Column()
  description!: string;

  @Column()
  category!: string;

  @ManyToOne(() => HotelEntity, hotel => hotel.products)
  hotel!: HotelEntity;
}
