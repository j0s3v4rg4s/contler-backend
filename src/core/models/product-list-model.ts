import { ProductEntity } from '../entity';

export interface ObjectCategoryProduct {
  [key: string]: CategoryProductList;
}

export interface CategoryProductList {
  category: string;
  productList: ProductListModel[];
}

export interface ProductListModel {
  product: ProductEntity;
  quantity: number;
}
