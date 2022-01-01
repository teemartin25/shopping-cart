import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from './category.model';
import { Product } from './product.model';
import { Profile } from './profile.model';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  updatedCategories = new BehaviorSubject<Category[]>([]);
  updatedProducts = new BehaviorSubject<Product[]>([]);
  updatedProfiles = new BehaviorSubject<Profile[]>([]);

  constructor(private http: HttpClient) {}

  onAddCategory(category: Category) {
    //console.log(category);

    this.http
      .post<Category>(
        'https://shopping-cart-b89f4-default-rtdb.firebaseio.com/categories.json',
        category
      )
      .subscribe((responseData) => {
        //  console.log(responseData);
        this.fetchCategories();
      });
  }

  fetchCategories() {
    this.http
      .get<Category[]>(
        'https://shopping-cart-b89f4-default-rtdb.firebaseio.com/categories.json'
      )
      .pipe(
        map((responseData) => {
          const categoriesArray = [];

          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              categoriesArray.push({ ...responseData[key], firebaseId: key });
            }
          }
          return categoriesArray;
        })
      )
      .subscribe((categories) => {
        // console.log(categories);
        this.updatedCategories.next(categories);
      });
  }

  deleteCategory(deletedCategory: Category) {
    this.http
      .delete(
        `https://shopping-cart-b89f4-default-rtdb.firebaseio.com/categories/${deletedCategory.firebaseId}.json`
      )
      .subscribe();
  }

  onEditCategory(editedCategory: Category) {
    //  console.log(editedCategory);

    this.http
      .put(
        `https://shopping-cart-b89f4-default-rtdb.firebaseio.com/categories/${editedCategory.firebaseId}.json`,
        editedCategory
      )
      .subscribe();
  }

  onAddProduct(addedProduct: Product) {
    // console.log(addedProduct);

    this.http
      .post(
        'https://shopping-cart-b89f4-default-rtdb.firebaseio.com/products.json',
        addedProduct
      )
      .subscribe((responseData) => {
        //  console.log(responseData);
        this.fetchProducts();
      });
  }

  fetchProducts() {
    this.http
      .get<Product[]>(
        'https://shopping-cart-b89f4-default-rtdb.firebaseio.com/products.json'
      )
      .pipe(
        map((responseData) => {
          const productsArray = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              productsArray.push({ ...responseData[key], firebaseId: key });
            }
          }
          return productsArray;
        })
      )
      .subscribe((products) => {
        // console.log(products);
        this.updatedProducts.next(products);
      });
  }

  deleteProduct(deletedProduct: Product) {
    this.http
      .delete(
        `https://shopping-cart-b89f4-default-rtdb.firebaseio.com/products/${deletedProduct.firebaseId}.json`
      )
      .subscribe();
  }

  onEditProduct(editedProduct: Product) {
    //console.log(editedProduct);

    this.http
      .put(
        ` https://shopping-cart-b89f4-default-rtdb.firebaseio.com/products/${editedProduct.firebaseId}.json`,
        editedProduct
      )
      .subscribe();
  }

  onCreateProfile(createdProfile: Profile) {
    //  console.log(createdProfile);

    this.http
      .post(
        'https://shopping-cart-b89f4-default-rtdb.firebaseio.com/profiles.json',
        createdProfile
      )
      .subscribe((responseData) => {
        //   console.log(responseData);
        this.fetchProfiles();
      });
  }

  fetchProfiles() {
    this.http
      .get<Profile[]>(
        'https://shopping-cart-b89f4-default-rtdb.firebaseio.com/profiles.json'
      )
      .pipe(
        map((responseData) => {
          const profilesArray = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              profilesArray.push({ ...responseData[key], firebaseId: key });
            }
          }
          return profilesArray;
        })
      )
      .subscribe((profiles) => {
        //   console.log(profiles);
        this.updatedProfiles.next(profiles);
      });
  }

  editProfile(editedProfile: Profile) {
    // console.log(editedProfile);

    this.http
      .put(
        `https://shopping-cart-b89f4-default-rtdb.firebaseio.com/profiles/${editedProfile.firebaseId}.json`,
        editedProfile
      )
      .subscribe();
  }
}
