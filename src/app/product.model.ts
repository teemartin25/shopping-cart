export class Product {
  constructor(
    public productName: string,
    public productId: string,
    public productImage: string,
    public productPrice: number,
    public productDescription: string,
    public productCategory: string,
    public productCartQuantity: number,
    public firebaseId?: string
  ) {}
}
