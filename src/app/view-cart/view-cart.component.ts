import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DataStorageService } from '../data-storage.service';
import { Product } from '../product.model';
import { Profile } from '../profile.model';
import Toast from 'bootstrap/js/dist/toast';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-cart',
  templateUrl: './view-cart.component.html',
  styleUrls: ['./view-cart.component.css'],
})
export class ViewCartComponent implements OnInit, OnDestroy {
  cart: Product[];
  total: number;
  updatedCurrentProfile: Profile;

  //Property Created For Toasts
  removedItemFromCart: Product;
  //

  private activatedSub1: Subscription;
  private activatedSub2: Subscription;

  constructor(private dataStorageService: DataStorageService) {}

  @ViewChild('myToast1', { static: true }) toastEl1: ElementRef<HTMLDivElement>;
  deleteItemToast: Toast | null = null;

  ngOnInit(): void {
    this.activatedSub1 = this.dataStorageService.updatedCart.subscribe(
      (updatedCart) => {
        // console.log(updatedCart);
        if (updatedCart) {
          // console.log('not null from VIEwCART');
          // console.log(updatedCart);
          this.cart = updatedCart;
          this.total = this.dataStorageService.getTotal();
        } else {
          // console.log('null from VIEWCART');
          // console.log(updatedCart);
          this.cart = null;
        }
      }
    );

    this.activatedSub2 =
      this.dataStorageService.updatedCurrentProfile.subscribe(
        (currentProfile) => {
          this.updatedCurrentProfile = currentProfile;
        }
      );

    this.dataStorageService.updateExistingCartItems();
    this.total = this.dataStorageService.getTotal();

    this.deleteItemToast = new Toast(this.toastEl1.nativeElement, {});
  }

  ngOnDestroy() {
    this.activatedSub1.unsubscribe();
    this.activatedSub2.unsubscribe();
  }

  addItemQuantity(product: Product) {
    if (product.productCartQuantity === 10) return;

    this.dataStorageService.addItemCartCount(product);
  }

  subtractItemQuantity(product: Product) {
    if (product.productCartQuantity === 1) return;

    this.dataStorageService.subtractItemCartCount(product);
  }
  deleteItemFromCart(product: Product) {
    this.removedItemFromCart = product;
    this.dataStorageService.deleteItemFromCart(product);
    this.showDeleteItemToast();
  }

  showDeleteItemToast() {
    this.deleteItemToast!.show();
  }
}
