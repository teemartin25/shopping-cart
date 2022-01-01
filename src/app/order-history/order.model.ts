import { Product } from '../product.model';

export class Order {
  constructor(
    public orderDate: Date,
    public orderedItems: Product[],
    public orderTotal: Number,
    public orderPaymentMethod: string
  ) {}
}
