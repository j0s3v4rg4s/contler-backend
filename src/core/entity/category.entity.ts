import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ZoneEntity } from './zone.entity';

@Entity({name: 'category'})
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToMany(() => ZoneEntity, zone => zone.hotel)
  zones!: ZoneEntity[];
}
