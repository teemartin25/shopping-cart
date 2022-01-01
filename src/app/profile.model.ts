import { Order } from './order-history/order.model';
import { Product } from './product.model';

export class Profile {
  constructor(
    public firstName: string,
    public lastName: string,
    public email: string,
    public imagePath: string,
    public address: string,
    public accessType?: string,
    public firebaseId?: string,
    public cart?: Product[],
    public orderHistory?: Order[]
  ) {}
}
