import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category } from '../category.model';
import { DataStorageService } from '../data-storage.service';
import { Product } from '../product.model';

@Component({
  selector: 'app-add-product-form',
  templateUrl: './add-product-form.component.html',
  styleUrls: ['./add-product-form.component.css'],
})
export class AddProductFormComponent implements OnInit, OnDestroy {
  categories!: Category[];
  displayPriceLabel: string;
  category!: any;
  catId!: string;
  addProductForm: FormGroup;
  priceControlIsTouched: boolean = false;
  forbiddenProductIds: any = [];
  products: Product[];

  private activatedSub1: Subscription;
  private activatedSub2: Subscription;

  constructor(
    private dataStorageService: DataStorageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    //console.log('initialized');

    this.activatedSub1 = this.dataStorageService.updatedCategories.subscribe(
      (updatedCategories) => {
        this.categories = updatedCategories;
      }
    );

    this.dataStorageService.getCategories();

    this.catId = this.route.snapshot.params['id'];
    //console.log(this.catId);

    this.route.params.subscribe((params) => {
      this.catId = params['id'];
      const category = this.categories.find(
        (category) => category.categoryId === this.catId
      );
      this.category = category;
    });

    this.activatedSub2 = this.dataStorageService.updatedProducts.subscribe(
      (updatedProducts) => {
        this.products = updatedProducts;

        for (const key in updatedProducts) {
          if (updatedProducts.hasOwnProperty(key)) {
            this.forbiddenProductIds.push(updatedProducts[key].productId);
          }
        }
      }
    );

    this.dataStorageService.getProducts();

    const category = this.categories.find(
      (category) => category.categoryId === this.catId
    );
    this.category = category;

    this.addProductForm = new FormGroup({
      productName: new FormControl(null, Validators.required),
      productId: new FormControl(null, [
        Validators.required,
        this.forbiddenProductId.bind(this),
      ]),
      productImage: new FormControl(null, Validators.required),
      productPrice: new FormControl(null, Validators.required),
      productDescription: new FormControl(null, Validators.required),
      productCategory: new FormControl(
        this?.category?.categoryId,
        Validators.required
      ),
    });
  }

  ngOnDestroy() {
    this.activatedSub1.unsubscribe();
    this.activatedSub2.unsubscribe();
  }

  updateProductPriceControl() {
    this.addProductForm.patchValue({
      productPrice: this.displayPriceLabel,
    });

    this.priceControlIsTouched = true;
  }
  onSubmit() {
    this.addProductForm.patchValue({
      productPrice: this.displayPriceLabel,
    });

    const newlyAddedProduct = new Product(
      this.addProductForm.value.productName,
      this.addProductForm.value.productId,
      this.addProductForm.value.productImage,
      this.addProductForm.value.productPrice,
      this.addProductForm.value.productDescription,
      this.addProductForm.value.productCategory,
      0
    );

    // console.log(newlyAddedProduct);
    this.dataStorageService.addToProducts(newlyAddedProduct);

    if (this.router.url.match('/categories') === null) {
      // console.log('From ALL PRODUCTS PAGE');

      this.router.navigate(['/all-products'], {
        queryParams: { allowEdit: '1' },
      });

      setTimeout(() => {
        this.dataStorageService.triggerAddProductToastAllProductsPage.next(
          this.addProductForm.value
        );
      }, 200);
    } else {
      // console.log('From CATEGORIES Page');

      this.router.navigate(['/categories', this.catId], {
        queryParams: { allowEdit: '1' },
      });

      setTimeout(() => {
        this.dataStorageService.triggerAddProductToastCategoryPage.next(
          this.addProductForm.value
        );
      }, 200);
    }
  }

  forbiddenProductId(control: FormControl): { [s: string]: boolean } {
    if (this.forbiddenProductIds.indexOf(control.value) !== -1) {
      return { productIdIsForbidden: true };
    }
    return null;
  }
}
