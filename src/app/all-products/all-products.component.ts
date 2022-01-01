import { CurrencyPipe } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Category } from '../category.model';
import { DataStorageService } from '../data-storage.service';
import { Product } from '../product.model';
import { Profile } from '../profile.model';
import { SortAlphabeticalAToZPipe } from '../sort-alphabetical-a-to-z.pipe';
import { SortHighToLowPipe } from '../sort-high-to-low.pipe';
import { SortLowToHighPipe } from '../sort-low-to-high.pipe';
import Toast from 'bootstrap/js/dist/toast';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css'],
})
export class AllProductsComponent implements OnInit, OnDestroy {
  categories!: Category[];
  category!: any;
  catId!: string;
  allowEdit: boolean = false;
  updatedCurrentProfile: Profile;

  addProductButtonClicked: boolean = false;
  deletedProduct: Product;
  products!: Product[];
  p: number = 1;
  filteredStatus = '';

  //Properties Created For Toasts
  addedToCartProduct: Product;
  addedProduct: Product;
  editedProduct: Product;
  //

  private activatedSub1: Subscription;
  private activatedSub2: Subscription;
  private activatedSub3: Subscription;
  private activatedSub4: Subscription;
  private activatedSub5: Subscription;
  private activatedSub6: Subscription;

  constructor(
    private route: ActivatedRoute,
    private dataStorageService: DataStorageService,
    private sortHighToLow: SortHighToLowPipe,
    private sortLowTohigh: SortLowToHighPipe,
    private sortAlphabeticalAToZ: SortAlphabeticalAToZPipe
  ) {}

  @ViewChild('myToast1', { static: true }) toastEl1: ElementRef<HTMLDivElement>;
  editToast: Toast | null = null;

  @ViewChild('myToast2', { static: true }) toastEl2: ElementRef<HTMLDivElement>;
  deleteToast: Toast | null = null;

  @ViewChild('myToast3', { static: true }) toastEl3: ElementRef<HTMLDivElement>;
  addToast: Toast | null = null;

  @ViewChild('myToast4', { static: true }) toastEl4: ElementRef<HTMLDivElement>;
  addToCartToast: Toast | null = null;

  ngOnInit(): void {
    this.activatedSub1 = this.dataStorageService.updatedCategories.subscribe(
      (updatedCategories) => {
        this.categories = updatedCategories;
      }
    );

    this.dataStorageService.getCategories();

    this.catId = this.route.snapshot.params['id'];

    this.route.queryParams.subscribe((queryParams: Params) => {
      this.allowEdit = queryParams['allowEdit'] === '1' ? true : false;
    });

    //console.log(this.category);

    this.activatedSub2 = this.dataStorageService.updatedProducts.subscribe(
      (updatedProducts) => {
        this.products = updatedProducts;
        this.sortAlphabeticalAtoZ();
      }
    );
    this.dataStorageService.getProducts();

    this.activatedSub3 =
      this.dataStorageService.updatedCurrentProfile.subscribe(
        (currentProfile) => {
          this.updatedCurrentProfile = currentProfile;
        }
      );

    this.activatedSub4 =
      this.dataStorageService.triggerEditProductToastAllProductsPage.subscribe(
        (trigger) => {
          this.editedProduct = trigger;
          this.showEditToast();
        }
      );

    this.activatedSub5 =
      this.dataStorageService.triggerAddProductToastAllProductsPage.subscribe(
        (trigger) => {
          this.addedProduct = trigger;
          this.showAddToast();
        }
      );

    this.activatedSub6 =
      this.dataStorageService.triggerAddToCartToastAllProductsPage.subscribe(
        (trigger) => {
          this.showAddToCartToast();
        }
      );

    this.editToast = new Toast(this.toastEl1.nativeElement, {});
    this.deleteToast = new Toast(this.toastEl2.nativeElement, {});
    this.addToast = new Toast(this.toastEl3.nativeElement, {});
    this.addToCartToast = new Toast(this.toastEl4.nativeElement, {});
  }

  ngOnDestroy() {
    this.activatedSub1.unsubscribe();
    this.activatedSub2.unsubscribe();
    this.activatedSub3.unsubscribe();
    this.activatedSub4.unsubscribe();
    this.activatedSub5.unsubscribe();
    this.activatedSub6.unsubscribe();
  }

  addToCart(product: Product) {
    // console.log(product);

    this.dataStorageService.addToCart(product);
    this.addedToCartProduct = product;
  }
  addProductClicked() {
    this.addProductButtonClicked = !this.addProductButtonClicked;
  }

  onDeleteProduct(deletedProduct: Product) {
    // console.log(deletedProduct);

    this.deletedProduct = deletedProduct;
  }

  onModalDelete() {
    this.dataStorageService.deleteFromProducts(this.deletedProduct);
    this.showDeleteToast();
  }

  onEdit() {
    setTimeout(() => {
      const element = document.getElementById(
        'editProductTrigger-allProductsPage'
      );
      element.click();
    }, 1);
  }

  sortPriceHighToLow() {
    //console.log('sort!');
    this.p = 1;
    this.products = this.sortHighToLow.transform(
      this.products.slice(),
      'productPrice'
    );
  }
  sortPriceLowToHigh() {
    //  console.log('sort!');

    this.p = 1; // So page starts back at page 1 whenever they sort
    this.products = this.sortLowTohigh.transform(
      this.products.slice(),
      'productPrice'
    );
  }

  sortAlphabeticalAtoZ() {
    this.p = 1; // So page starts back at page 1 whenever they sort
    this.products = this.sortAlphabeticalAToZ.transform(
      this.products.slice(),
      'productName'
    );
  }

  showEditToast() {
    this.editToast!.show();
  }

  showDeleteToast() {
    this.deleteToast!.show();
  }

  showAddToast() {
    this.addToast!.show();
  }

  showAddToCartToast() {
    this.addToCartToast!.show();
  }

  modelChange(value) {
    this.p = 1; // So page starts back at page 1 whenever they filter
  }
}

//
