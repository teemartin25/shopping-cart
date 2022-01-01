import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { Category } from './category.model';
import { Order } from './order-history/order.model';
import { Product } from './product.model';
import { Profile } from './profile.model';
import { RequestsService } from './requests.service';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  constructor(private requestsService: RequestsService) {}

  updatedCategories = new BehaviorSubject<Category[]>([]);
  updatedProducts = new Subject<Product[]>();
  updatedCart = new BehaviorSubject<Product[]>([]);
  updatedCartCount = new BehaviorSubject<number>(null);
  updatedProfiles = new BehaviorSubject<Profile[]>([]);
  updatedCurrentProfile = new BehaviorSubject<Profile>(null);

  //Toasts and Modals
  triggerEditCategoryToast = new Subject<Category>();
  triggerAddCategoryToast = new Subject<Category>();

  triggerEditProductToastCategoryPage = new Subject<Product>();
  triggerAddProductToastCategoryPage = new Subject<Product>();
  triggerAddToCartToastCategoryPage = new Subject<Product>();

  triggerEditProductToastAllProductsPage = new Subject<Product>();
  triggerAddProductToastAllProductsPage = new Subject<Product>();
  triggerAddToCartToastAllProductsPage = new Subject<Product>();

  triggerEditedProfileToastCategoriesPage = new Subject<Profile>();

  triggerModalCloseForAutoLogout = new Subject<boolean>();
  //
  //
  categories: Category[] = [];
  orderHistory: Order[] = [];
  profiles: Profile[] = [];
  cart: Product[] = [];
  cartCount: number = 0;
  products: Product[] = [
    // Hats
    new Product(
      'Under Armour Run Shadow Cap',
      'underarmourcap1',
      'https://firebasestorage.googleapis.com/v0/b/shopping-cart-b89f4.appspot.com/o/ShoppingCartApp%2FProducts%2FHats%2FUnderArmorCap.jpeg?alt=media&token=f1f1dcd9-f560-4ca2-bd02-4566eeeddc5f',
      24.99,
      'Best for running. Two-toned logo cap with mesh panel. UA Siro sweatband for stretch & recovery. UPF 30 protects from the sun rays. Polyester. Adjustable velcro fastening.',
      'hats01',
      0
    ),

    new Product(
      'Puma Bucket Hat',
      'pumabucket1',
      'https://firebasestorage.googleapis.com/v0/b/shopping-cart-b89f4.appspot.com/o/ShoppingCartApp%2FProducts%2FHats%2FPumaBucketHat.png?alt=media&token=b20c3508-92b5-4ac5-9d01-ac5f7fe9d4a3',
      14.99,
      'Best for running. Two-toned logo cap with mesh panel. UA Siro sweatband for stretch & recovery. UPF 30 protects from the sun rays. Polyester. Adjustable velcro fastening.',
      'hats01',
      0
    ),

    new Product(
      'Nordstrom Straw Fedora Hat',
      'nordstromstrawfedora1',
      'https://firebasestorage.googleapis.com/v0/b/shopping-cart-b89f4.appspot.com/o/ShoppingCartApp%2FProducts%2FHats%2FNordstromFedoraHat.jpeg?alt=media&token=ac65aef2-cee1-4220-bf18-0d714601570d',
      10.49,
      'Woven color-blocked accents bring a sophisticated flourish to this classic trilby made from straw. Versatility, ease and affordability are hallmarks of the Nordstrom collection. Available exclusively at Nordstrom.',
      'hats01',
      0
    ),

    new Product(
      'Hemingway Sailor Cap',
      'hemingwaysailor1',
      'https://firebasestorage.googleapis.com/v0/b/shopping-cart-b89f4.appspot.com/o/ShoppingCartApp%2FProducts%2FHats%2FHemingwaySailorCap.jpeg?alt=media&token=b94dd7ec-0871-4f95-bfa5-98f576abaa21',
      15.99,
      'The main material of the hat is polyester, which is not easy to deform and can be washed; The icon is embroidered, the belt is added with metal buttons, the overall stylish and delicate, the navy hat is unisex too!',
      'hats01',
      0
    ),

    //Eyewear
    new Product(
      'Ray-Ban Wayfarers',
      'rbwayfarer1',
      'https://firebasestorage.googleapis.com/v0/b/shopping-cart-b89f4.appspot.com/o/ShoppingCartApp%2FProducts%2FEyewear%2FWayfarer.jpeg?alt=media&token=a9052e5d-823b-43c0-8a05-135a008254c9',
      150.0,
      `As the world's most famous eyewear brand, as well as the inventors of both the Aviator and Wayfarer sunglasses, Ray-Ban has cultivated a well-deserved reputation for trendsetting. Every frame they sell is constructed with the highest quality components. Their fresh styling, with a contemporary, yet vintage, look continually appeals to millions of loyal customers.`,
      'eyewear01',
      0
    ),

    new Product(
      'Ray-Ban Cats 5000 Aviator Sunglasses',
      'rbaviator1',
      'https://firebasestorage.googleapis.com/v0/b/shopping-cart-b89f4.appspot.com/o/ShoppingCartApp%2FProducts%2FEyewear%2FAviator.jpeg?alt=media&token=faca55d4-f384-4a07-86eb-edc474b4e7cc',
      176.0,
      'Currently one of the most iconic sunglass models in the world, Ray-Ban Aviator Classic sunglasses were originally designed for U.S. aviators in 1937. Aviator Classic sunglasses are a timeless model that combines great aviator styling with exceptional quality, performance and comfort.',
      'eyewear01',
      0
    ),

    new Product(
      'Ray-Ban Clubmaster',
      'rbclubmaster1',
      'https://firebasestorage.googleapis.com/v0/b/shopping-cart-b89f4.appspot.com/o/ShoppingCartApp%2FProducts%2FEyewear%2FClubMaster.jpeg?alt=media&token=8916032f-db01-4d13-aa60-73cd2e0f49fe',
      205.0,
      'Clubmasters are defined by angular wayfarer-like styling on the upper rim of a sunglasses frame tapering down to a rimless (or thin metal rim) portion on the bottom half of the frame.',
      'eyewear01',
      0
    ),

    new Product(
      'Ray-Ban Round Metal',
      'rbroundmetal1',
      'https://firebasestorage.googleapis.com/v0/b/shopping-cart-b89f4.appspot.com/o/ShoppingCartApp%2FProducts%2FEyewear%2FRoundMetal.jpeg?alt=media&token=1959f4a5-e22a-49a1-a0ff-b6d10fd21390',
      195.0,
      'The Ray-Ban ® Round Metal sunglasses are totally retro. This look has been worn by legendary musicians and inspired by the 1960s counter-culture when this style first originated.The Ray-Ban unisex metal, iconic sunglasses are known for their defined round crystal lenses and distinct shape. A curved brow bar, adjustable nose pads, and thin metal temples with plastic end tips rest comfortably behind the ears.',
      'eyewear01',
      0
    ),

    //Bags

    new Product(
      'Columbia Force Xii 35L Rolltop Backpack',
      'columbiaforce1',
      'https://firebasestorage.googleapis.com/v0/b/shopping-cart-b89f4.appspot.com/o/ShoppingCartApp%2FProducts%2FBags%2FColumbiaForceBag.png?alt=media&token=81a55999-923a-4b08-92ae-4aa48e86a7f3',
      190.0,
      `Weather-Ready Pack A Roll-Top, Tpu-Coated Backpack With A Fully Welded Waterproof Construction Stands Up To Surprise Sprinkles.
      Keep Everything In Its Place With A Front Accessory Pocket And Internal Organizer. A Breathable Back Panel And Cushioning Shoulder Straps Make For A Comfortable Fit.`,
      'bags01',
      0
    ),

    new Product(
      'Zara Black Bowling Bag',
      'zarabowlingbag1',
      'https://firebasestorage.googleapis.com/v0/b/shopping-cart-b89f4.appspot.com/o/ShoppingCartApp%2FProducts%2FBags%2FZaraBowlingBag.jpeg?alt=media&token=58533d3b-97c9-4671-b7d5-c39fa86286ba',
      89.9,
      'Black bowling bag. Solid color exterior. Main compartment with zip closure. Interior carabiner keychain to secure keys. Three interior pockets, one with zip closure. Two handles and one adjustable, removable shoulder strap.',
      'bags01',
      0
    ),

    new Product(
      'Nike Brasilia Training Bag',
      'nikebrasilia1',
      'https://firebasestorage.googleapis.com/v0/b/shopping-cart-b89f4.appspot.com/o/ShoppingCartApp%2FProducts%2FBags%2FNikeTrainingBag.jpeg?alt=media&token=6fb68c71-f456-4bb9-a1e1-dc4d374907a7',
      39.99,
      `The Nike Brasilia Duffel Bag doesn't let a little weather get in the way of your workout. It keeps your training gear close, dry and ready for use with multiple pockets in a durable, water-resistant design that stands up to the elements.`,
      'bags01',
      0
    ),

    new Product(
      'Gucci 100 Belt Bag',
      'gucci1001',
      'https://firebasestorage.googleapis.com/v0/b/shopping-cart-b89f4.appspot.com/o/ShoppingCartApp%2FProducts%2FBags%2FGucciBeltBag.jpeg?alt=media&token=816c5a58-771f-4c0c-af0c-12f28e14e528',
      1350.0,
      `In honor of the Centennial, The Gucci Aria collection presents an homage to the brand's legacy. Reminiscent of the retro logo trend, this belt bag features a colorful print that mixes the name of the House with 100.`,
      'bags01',
      0
    ),

    //Footwear

    new Product(
      'Adidas Yeezy Slides Pure',
      'yeezyslides1',
      'https://firebasestorage.googleapis.com/v0/b/shopping-cart-b89f4.appspot.com/o/ShoppingCartApp%2FProducts%2FFootwear%2FYeezySlides1.png?alt=media&token=13f26420-49a9-4554-9efc-7508f87b6fb9',
      60.0,
      `The adidas Yeezy Slide ‘Pure’ highlights a one-note beige finish throughout the exterior of the slip-on. Lightweight and durable, injected EVA foam makes up the composition of the one-piece build. The minimalist design is marked with an embossed adidas logo on the soft top layer of the footbed, good for immediate step-in comfort. Underfoot, the outsole is configured with deep flex grooves for a smooth ride and optimal grip.`,
      'footwear01',
      0
    ),

    new Product(
      'Adidas Ultraboost Lego',
      'ultraboostlego1',
      'https://firebasestorage.googleapis.com/v0/b/shopping-cart-b89f4.appspot.com/o/ShoppingCartApp%2FProducts%2FFootwear%2FAdidasUltraBoostLego.jpeg?alt=media&token=1859f128-f978-4c2e-8375-6e3b5e126c2f',
      160,
      `Running is your time to play. And if you couldn't tell by the pops of colour and LEGO® bricks inspired design, these adidas running shoes created with the LEGO Group are all about play. Play, and comfort. Because nothing needs to get in the way of a good time. A plush Boost midsole takes care of the cushioning, and the Continental™ Better Rubber outsole balances fast moves with steady grounding.`,
      'footwear01',
      0
    ),

    new Product(
      'Sperry Cross Lace Boat Shoes',
      'sperrycross1',
      'https://firebasestorage.googleapis.com/v0/b/shopping-cart-b89f4.appspot.com/o/ShoppingCartApp%2FProducts%2FFootwear%2FSperryBoatShoes.jpeg?alt=media&token=1be0fe05-1afd-45b5-b6af-47a24ad1662b',
      94.95,
      `The one that started it all, the Authentic Original is a tried-and-true icon of modern prep style. Featuring hand-sewn craftsmanship, premium materials, and the enhanced anti-slip traction that made them legendary, seafarers love the A/O’s capability, and street-farers crave its classic cool.`,
      'footwear01',
      0
    ),

    new Product(
      'Timberland 6-inch Waterproof Boots',
      'timberland6inch1',
      'https://firebasestorage.googleapis.com/v0/b/shopping-cart-b89f4.appspot.com/o/ShoppingCartApp%2FProducts%2FFootwear%2FTimberlandBoots.png?alt=media&token=4e254f94-3c98-436a-b1e2-a65e0dee943d',
      198.99,
      `Inspired by our original waterproof boot, this all-season style gives you tireless waterproof performance and instantly recognizable work-boot styling. Other essential features include 400 grams of warm, down-free PrimaLoft® insulation, a padded collar for a comfortable fit around the ankle, a steel shank for arch support, a rubber lug outsole for traction, and materials sourced with respect for the planet.`,
      'footwear01',
      0
    ),
  ];

  getCategories() {
    this.requestsService.updatedCategories.subscribe((updatedCategories) => {
      this.categories = updatedCategories;
      this.updatedCategories.next(this.categories);
    });
  }

  getProducts() {
    this.requestsService.updatedProducts.subscribe((updatedProducts) => {
      this.products = updatedProducts;
      this.updatedProducts.next(this.products);
      //console.log(this.products);
    });
  }

  // This method below is not yet finished. Might change this to getCurrentProfile instead. Can't impliment it yet. Might have to wait for authentication so we'll know . I'LL GO BACK HERE

  addToCart(product: Product) {
    const index = this.cart.findIndex(
      (item) => product.productId === item.productId
    );

    if (index === -1) {
      this.cart.push(
        new Product(
          product.productName,
          product.productId,
          product.productImage,
          product.productPrice,
          product.productDescription,
          product.productCategory,
          1
        )
      );
      this.updatedCart.next(this.cart);
    } else if (this.cart[index].productCartQuantity < 10) {
      this.cart[index].productCartQuantity++;
    } else {
      return;
    }

    // console.log(this.updatedCurrentProfile.value);

    this.updateCartCount();
    this.updateCartForCurrentProfile();
    this.triggerAddToCartToastCategoryPage.next(product);
    this.triggerAddToCartToastAllProductsPage.next(product);
  }

  getTotal() {
    let preTotal = [];
    for (const key in this.cart) {
      if (this.cart.hasOwnProperty(key)) {
        preTotal.push(
          this.cart[key].productPrice * this.cart[key].productCartQuantity
        );
      }
    }
    const total = preTotal.reduce((acc, cur) => acc + cur, 0);
    return total;
  }

  emptyCart() {
    this.cart = [];
    this.updatedCart.next(this.cart);
    // this.updateCartForCurrentProfile();
  }

  addToCategories(newCategory: Category) {
    // console.log(this.categories);
    // console.log(newCategory);

    this.categories.push(newCategory);

    this.requestsService.onAddCategory(newCategory);
  }

  deleteFromCategories(deletedCategory: Category) {
    //console.log(deletedCategory);

    const index = this.categories.findIndex(
      (category) => category.categoryId === deletedCategory.categoryId
    );

    this.categories.splice(index, 1);

    this.requestsService.deleteCategory(deletedCategory);
  }

  editCategories(editedCategory: Category) {
    const index = this.categories.findIndex(
      (category) => category.categoryId === editedCategory.categoryId
    );

    // console.log(editedCategory);
    //console.log(this.categories);

    this.categories[index] = editedCategory;

    this.updatedCategories.next(this.categories);

    this.requestsService.onEditCategory(editedCategory);
  }

  addToProducts(newProduct: Product) {
    this.products.push(newProduct);
    this.requestsService.onAddProduct(newProduct);
  }

  deleteFromProducts(deletedProduct: Product) {
    const index = this.products.findIndex(
      (product) => product.productId === deletedProduct.productId
    );

    this.products.splice(index, 1);
    this.updatedProducts.next(this.products);
    this.updateCartCount();
    this.requestsService.deleteProduct(deletedProduct);
  }

  editProduct(editedProduct: Product) {
    const index = this.products.findIndex(
      (product) => product.productId === editedProduct.productId
    );

    this.products[index] = editedProduct;
    this.updatedProducts.next(this.products);

    this.requestsService.onEditProduct(editedProduct);
  }

  // This method makes sure that the existing cart items that were added will also be updated if there were any changes on the item itself. E.g. change in price, deleted item. It will reflect on the View Cart Page.
  updateExistingCartItems() {
    this.updatedCart.subscribe((updatedCart) => {
      this.cart = updatedCart;
      //console.log(updatedCart);
      // console.log(this.updatedCart.value);
    });

    let newCartArray = [];

    for (const item in this.cart) {
      if (this.cart.hasOwnProperty(item)) {
        let itemQuantity: number = this.cart[item].productCartQuantity;
        const updatedItem = this.products.find(
          (product) => product.productId === this.cart[item].productId
        );
        if (!updatedItem) continue;
        this.cart[item] = updatedItem;
        this.cart[item].productCartQuantity = itemQuantity;
        newCartArray.push(this.cart[item]);
      }
    }

    // console.log(this.cart);
    // console.log(newCartArray);
    this.cart = newCartArray;
    this.updatedCart.next(this.cart);
    // this.updateCartForCurrentProfile();
  }

  updateCartCount() {
    this.updateExistingCartItems();
    let totalCartCount: number = 0;

    // console.log(this.updatedCart.value);
    // console.log(this.cart);

    for (const key in this.cart) {
      if (this.cart.hasOwnProperty(key)) {
        totalCartCount = totalCartCount + this.cart[key].productCartQuantity;
      }
    }
    // console.log(totalCartCount);

    this.cartCount = totalCartCount;
    this.updatedCartCount.next(this.cartCount);
    // console.log(this.cartCount);
  }

  addItemCartCount(productAdded: Product) {
    // console.log('ADD');
    // console.log(productAdded);

    const index = this.cart.findIndex(
      (product) => product.productId === productAdded.productId
    );

    //console.log(index);

    this.cart[index].productCartQuantity++;

    this.updateCartCount();
    this.updateCartForCurrentProfile();
  }

  subtractItemCartCount(productSubtracted: Product) {
    //console.log('SUBTRACT');
    //console.log(productSubtracted);

    const index = this.cart.findIndex(
      (product) => product.productId === productSubtracted.productId
    );
    // console.log(index);

    this.cart[index].productCartQuantity--;

    this.updateCartCount();
    this.updateCartForCurrentProfile();
  }

  deleteItemFromCart(productDeleted: Product) {
    // console.log('DELETED');
    // console.log(productDeleted);

    const index = this.cart.findIndex(
      (product) => product.productId === productDeleted.productId
    );

    this.cart.splice(index, 1);

    this.updateCartCount();
    this.updateCartForCurrentProfile();
  }

  getProfiles() {
    this.requestsService.updatedProfiles.subscribe((updatedProfiles) => {
      this.profiles = updatedProfiles;
      this.updatedProfiles.next(updatedProfiles);
      // console.log(updatedProfiles);
    });

    if (!this.updatedCurrentProfile.value) return;

    const currentProfile = this.profiles.find(
      (profile) => profile.email === this.updatedCurrentProfile.value.email
    );
    this.updatedCurrentProfile.next(currentProfile);
    // console.log(currentProfile);
  }

  createProfile(createdProfile: Profile) {
    this.profiles.push(createdProfile);
    this.updatedCurrentProfile.next(createdProfile);
    // console.log(this.profiles);

    this.requestsService.onCreateProfile(createdProfile);
  }

  editProfile(editedProfile: Profile) {
    const index = this.profiles.findIndex(
      (profile) => profile.email === editedProfile.email
    );

    editedProfile.orderHistory = this.updatedCurrentProfile.value.orderHistory;
    editedProfile.cart = this.cart;

    this.profiles[index] = editedProfile;
    this.updatedCurrentProfile.next(editedProfile);
    // console.log(editedProfile);
    // console.log(this.cart);

    this.requestsService.editProfile(editedProfile);
  }

  updateCartForCurrentProfile() {
    this.getProfiles();

    if (!this.updatedCurrentProfile.value) return;

    const editedProfileWithCart = this.updatedCurrentProfile;
    editedProfileWithCart.value.cart = this.cart;

    //console.log(this.updatedCurrentProfile.value);
    this.requestsService.editProfile(this.updatedCurrentProfile.value);
  }

  addOrderToProfileOrderHistory(order: Order) {
    // console.log(order);
    // console.log(this.updatedCurrentProfile.value);

    // console.log(this.orderHistory);

    if (!this.orderHistory) this.orderHistory = [];

    // console.log(this.orderHistory);
    // console.log(order);
    this.orderHistory.push(order);

    this.updatedCurrentProfile.value.orderHistory = this.orderHistory;
    this.updatedCurrentProfile.value.cart = [];
    this.cart = [];
    this.updatedCart.next(this.cart);
    this.updateCartForCurrentProfile();
  }

  emptyOrderHistory() {
    this.orderHistory = [];
  }
}
