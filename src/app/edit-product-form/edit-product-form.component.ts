import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category } from '../category.model';
import { DataStorageService } from '../data-storage.service';
import { Product } from '../product.model';

@Component({
  selector: 'app-edit-product-form',
  templateUrl: './edit-product-form.component.html',
  styleUrls: ['./edit-product-form.component.css'],
})
export class EditProductFormComponent implements OnInit, OnDestroy {
  categories!: Category[];
  products: Product[];
  displayPriceLabel: number;
  product!: Product;
  productId!: string;
  addProductForm: FormGroup;
  priceControlIsTouched: boolean = false;

  private activatedSub1: Subscription;
  private activatedSub2: Subscription;

  constructor(
    private dataStorageService: DataStorageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    //console.log('initialized!');
    this.activatedSub1 = this.dataStorageService.updatedCategories.subscribe(
      (updatedCategories) => {
        this.categories = updatedCategories;
      }
    );

    this.activatedSub2 = this.dataStorageService.updatedProducts.subscribe(
      (updatedProducts) => {
        this.products = updatedProducts;
      }
    );

    this.dataStorageService.getProducts();
    this.dataStorageService.getCategories();

    this.productId = this.route.snapshot.params['id'];

    this.route.params.subscribe((params) => {
      this.productId = params['id'];
      const product = this.products.find(
        (product) => product.productId === this.productId
      );
      //console.log(product);
      this.product = product;
    });

    //console.log(this.categories);
    //console.log(this.productId);
    //console.log(this.product);

    this.addProductForm = new FormGroup({
      productName: new FormControl(
        this.product.productName,
        Validators.required
      ),
      productId: new FormControl(this.product.productId, Validators.required),
      productImage: new FormControl(
        this.product.productImage,
        Validators.required
      ),
      productPrice: new FormControl(
        this.product.productPrice,
        Validators.required
      ),
      productDescription: new FormControl(
        this.product.productDescription,
        Validators.required
      ),
      productCategory: new FormControl(
        this.product.productCategory,
        Validators.required
      ),
    });

    this.displayPriceLabel = this.product.productPrice;
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

    const newlyEditedProduct = new Product(
      this.addProductForm.value.productName,
      this.addProductForm.value.productId,
      this.addProductForm.value.productImage,
      this.addProductForm.value.productPrice,
      this.addProductForm.value.productDescription,
      this.addProductForm.value.productCategory,
      0,
      this.product.firebaseId
    );

    // console.log(newlyEditedProduct);
    this.dataStorageService.editProduct(newlyEditedProduct);

    //console.log(this.router.url.match('/categories'));

    if (this.router.url.match('/categories') === null) {
      //  console.log('From ALL PRODCUTS Page');

      this.router.navigate(['/all-products'], {
        queryParams: { allowEdit: '1' },
      });

      setTimeout(() => {
        this.dataStorageService.triggerEditProductToastAllProductsPage.next(
          this.addProductForm.value
        );
      }, 200);
    } else {
      // console.log('From CATEGORIES Page');

      this.router.navigate(['/categories', this.product.productCategory], {
        queryParams: { allowEdit: '1' },
      });
      setTimeout(() => {
        this.dataStorageService.triggerEditProductToastCategoryPage.next(
          this.addProductForm.value
        );
      }, 200);
    }
  }
}
