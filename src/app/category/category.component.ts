import { CurrencyPipe } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Category } from '../category.model';
import { DataStorageService } from '../data-storage.service';
import { Product } from '../product.model';
import { Profile } from '../profile.model';
import Toast from 'bootstrap/js/dist/toast';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit, OnDestroy {
  categories!: Category[];
  category!: any;
  catId!: string;
  deletedProduct: Product;
  allowEdit: boolean = false;
  updatedCurrentProfile: Profile;

  //addProductButtonClicked: boolean = false;

  products!: Product[];

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
  private activatedSub7: Subscription;

  constructor(
    private route: ActivatedRoute,
    private dataStorageService: DataStorageService,
    private currencyPipe: CurrencyPipe
  ) {}

  @ViewChild('myToast1', { static: true })
  toastEl1!: ElementRef<HTMLDivElement>;
  editToast: Toast | null = null;

  @ViewChild('myToast2', { static: true })
  toastEl2!: ElementRef<HTMLDivElement>;
  deleteToast: Toast | null = null;

  @ViewChild('myToast3', { static: true })
  toastEl3!: ElementRef<HTMLDivElement>;
  addToast: Toast | null = null;

  @ViewChild('myToast4', { static: true })
  toastEl4!: ElementRef<HTMLDivElement>;
  addToCartToast: Toast | null = null;

  ngOnInit(): void {
    this.activatedSub1 = this.dataStorageService.updatedCategories.subscribe(
      (updatedCategories) => {
        this.categories = updatedCategories;
      }
    );

    this.dataStorageService.getCategories();

    this.catId = this.route.snapshot.params['id'];

    this.route.params.subscribe((params) => {
      this.catId = params['id'];
      const category = this.categories.find(
        (category) => category.categoryId === this.catId
      );
      this.category = category;
    });

    this.activatedSub2 = this.route.queryParams.subscribe(
      (queryParams: Params) => {
        this.allowEdit = queryParams['allowEdit'] === '1' ? true : false;
      }
    );

    const category = this.categories.find(
      (category) => category.categoryId === this.catId
    );
    this.category = category;

    //console.log(this.category);

    this.activatedSub3 = this.dataStorageService.updatedProducts.subscribe(
      (updatedProducts) => {
        this.products = updatedProducts;
      }
    );

    this.dataStorageService.getProducts();
    this.dataStorageService.getProfiles();

    this.activatedSub4 =
      this.dataStorageService.updatedCurrentProfile.subscribe(
        (currentProfile) => {
          this.updatedCurrentProfile = currentProfile;
        }
      );

    this.activatedSub5 =
      this.dataStorageService.triggerEditProductToastCategoryPage.subscribe(
        (product) => {
          this.editedProduct = product;
          this.showEditToast();
        }
      );

    this.activatedSub6 =
      this.dataStorageService.triggerAddProductToastCategoryPage.subscribe(
        (product) => {
          this.addedProduct = product;
          this.showAddToast();
        }
      );

    this.activatedSub7 =
      this.dataStorageService.triggerAddToCartToastCategoryPage.subscribe(
        (product) => {
          // console.log(product);
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
    this.activatedSub7.unsubscribe();
  }

  addToCart(product: Product) {
    // console.log(product);

    this.dataStorageService.addToCart(product);
    this.addedToCartProduct = product;
  }
  // addProductClicked() {
  //   this.addProductButtonClicked = !this.addProductButtonClicked;
  // }

  onDeleteProduct(deletedProduct: Product) {
    //console.log(deletedProduct);
    this.deletedProduct = deletedProduct;
  }

  onModalDelete() {
    this.dataStorageService.deleteFromProducts(this.deletedProduct);
    this.showDeleteToast();
  }

  onEdit() {
    setTimeout(() => {
      const element = document.getElementById('editProductModalTrigger');
      element.click();
    }, 1);
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
}
