import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from './product.entity';
import { OrderEntity } from './order.entity';

@Entity({ name: 'product_order' })
export class ProductOrderEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => ProductEntity)
  @JoinColumn()
  product!: ProductEntity;

  @Column()
  quantity!: number;

  @ManyToOne(() => OrderEntity, order => order.productsOrder)
  order: OrderEntity;
}
