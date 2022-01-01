import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CategoriesComponent } from './categories/categories.component';

import { CheckoutComponent } from './checkout/checkout.component';
import { ViewCartComponent } from './view-cart/view-cart.component';
import { AuthComponent } from './auth/auth.component';
import { CategoryComponent } from './category/category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { AddProductFormComponent } from './add-product-form/add-product-form.component';
import { AddCategoryFormComponent } from './add-category-form/add-category-form.component';
import { EditCategoryFormComponent } from './edit-category-form/edit-category-form.component';
import { EditProductFormComponent } from './edit-product-form/edit-product-form.component';
import { AllProductsComponent } from './all-products/all-products.component';
import { PaymentMethodPipe } from './paymentMethod.pipe';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipe } from './filter.pipe';
import { SortHighToLowPipe } from './sort-high-to-low.pipe';
import { SortLowToHighPipe } from './sort-low-to-high.pipe';
import { SortAlphabeticalAToZPipe } from './sort-alphabetical-a-to-z.pipe';
import { ModalGuardForCheckoutPageComponent } from './modal-guard-for-checkout-page/modal-guard-for-checkout-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    CategoriesComponent,
    CheckoutComponent,
    ViewCartComponent,
    AuthComponent,
    CategoryComponent,
    AddProductFormComponent,
    AddCategoryFormComponent,
    EditCategoryFormComponent,
    EditProductFormComponent,
    AllProductsComponent,
    PaymentMethodPipe,
    CreateProfileComponent,
    EditProfileComponent,
    OrderHistoryComponent,
    FilterPipe,
    SortHighToLowPipe,
    SortLowToHighPipe,
    SortAlphabeticalAToZPipe,
    ModalGuardForCheckoutPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule,
  ],
  providers: [
    CurrencyPipe,
    SortHighToLowPipe,
    SortLowToHighPipe,
    SortAlphabeticalAToZPipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
