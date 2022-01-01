import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCategoryFormComponent } from './add-category-form/add-category-form.component';
import { AddProductFormComponent } from './add-product-form/add-product-form.component';
import { AllProductsComponent } from './all-products/all-products.component';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryComponent } from './category/category.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { EditCategoryFormComponent } from './edit-category-form/edit-category-form.component';
import { EditProductFormComponent } from './edit-product-form/edit-product-form.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ModalGuardForCheckoutPageComponent } from './modal-guard-for-checkout-page/modal-guard-for-checkout-page.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { ViewCartComponent } from './view-cart/view-cart.component';

const routes: Routes = [
  { path: '', component: AuthComponent },
  {
    path: 'categories',
    component: CategoriesComponent,
    children: [
      { path: 'edit/:id', component: EditCategoryFormComponent },
      { path: 'add', component: AddCategoryFormComponent },
    ],
  },
  {
    path: 'categories/:id',
    component: CategoryComponent,
    children: [
      { path: 'product/edit/:id', component: EditProductFormComponent },
      { path: 'add/:id', component: AddProductFormComponent },
    ],
  },
  {
    path: 'all-products',
    component: AllProductsComponent,
    children: [
      { path: 'product/edit/:id', component: EditProductFormComponent },
      { path: 'add', component: AddProductFormComponent },
    ],
  },
  { path: 'view-cart', component: ViewCartComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'create-profile', component: CreateProfileComponent },
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'order-history', component: OrderHistoryComponent },
  { path: 'please-login', component: ModalGuardForCheckoutPageComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
