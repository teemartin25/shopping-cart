import { CurrencyPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataStorageService } from '../data-storage.service';
import Modal from 'bootstrap/js/dist/modal';
import { Profile } from '../profile.model';
import { Order } from '../order-history/order.model';
import { Product } from '../product.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  total!: any;
  paymentForm!: FormGroup;
  formattedAmount!: any;
  currentProfile: Profile;
  paymentDetails = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    paymentMethod: '',
    amount: '',
  };

  order = {
    orderDate: new Date(),
    orderTotal: +'',
    orderedItems: [],
    orderPaymentMethod: '',
  };
  orderedItems: Product[];

  private activatedSub1: Subscription;
  private activatedSub2: Subscription;

  constructor(
    private dataStorageService: DataStorageService,
    private currencyPipe: CurrencyPipe
  ) {}

  ngOnInit(): void {
    this.activatedSub1 = this.dataStorageService.updatedCart.subscribe(
      (updatedCart) => {
        this.orderedItems = updatedCart;
      }
    );

    this.dataStorageService.updateExistingCartItems();
    this.total = this.dataStorageService.getTotal();

    this.paymentForm = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      address: new FormControl(null, Validators.required),
      savePaymentInfo: new FormControl(null),
      paymentMethod: new FormControl(null, Validators.required),
      amount: new FormControl(null, Validators.required),
    });

    this.paymentForm.patchValue({
      amount: this.total.toFixed(2),
    });

    // console.log(this.total);

    this.activatedSub2 =
      this.dataStorageService.updatedCurrentProfile.subscribe(
        (updatedCurrentProfile) => {
          if (!updatedCurrentProfile) return;

          this.currentProfile = updatedCurrentProfile;
        }
      );

    this.dataStorageService.triggerModalCloseForAutoLogout.subscribe(
      (trigger) => {
        this.hideOpenedModal();
      }
    );
  }

  ngOnDestroy() {
    this.activatedSub1.unsubscribe();
    this.activatedSub2.unsubscribe();
  }

  onSubmit() {
    // console.log(this.paymentForm);

    // console.log(this.paymentForm.value.amount);

    if (this.orderedItems.length <= 0) {
      const myModal = document.getElementById('staticBackdrop');

      const modal = new Modal(myModal);

      modal.show();
      return;
    }

    this.paymentDetails.firstName = this.paymentForm.value.firstName;
    this.paymentDetails.lastName = this.paymentForm.value.lastName;
    this.paymentDetails.email = this.paymentForm.value.email;
    this.paymentDetails.address = this.paymentForm.value.address;
    this.paymentDetails.paymentMethod = this.paymentForm.value.paymentMethod;
    this.paymentDetails.amount = this.paymentForm.value.amount;

    // console.log(this.orderedItems);
    this.order.orderDate = new Date();
    this.order.orderTotal = this.total;
    this.order.orderedItems = this.orderedItems;
    this.order.orderPaymentMethod = this.paymentForm.value.paymentMethod;

    //console.log(this.order);
    this.dataStorageService.addOrderToProfileOrderHistory(this.order);
    // Clean Up
    this.paymentForm.reset();
    this.total = 0;
    this.dataStorageService.emptyCart();
    this.dataStorageService.updateCartCount();

    //So that payment form is still valid after resetting. Hence it will show the modal saying they need to add items first in order to checkout.
    this.paymentForm.patchValue({
      amount: 0,
    });

    this.openModal();
    // console.log(this.paymentForm.value.amount);
  }

  openModal() {
    const myModal = document.getElementById('checkoutSummaryModal');
    const modal = new Modal(myModal);
    modal.show();
  }

  clickedCheckbox() {
    //  console.log(this.paymentForm.value.savePaymentInfo);

    if (!this.paymentForm.value.savePaymentInfo) {
      this.paymentForm.patchValue({
        firstName: this.currentProfile.firstName,
        lastName: this.currentProfile.lastName,
        email: this.currentProfile.email,
        address: this.currentProfile.address,
      });
    } else {
      this.paymentForm.patchValue({
        firstName: null,
        lastName: null,
        email: null,
        address: null,
      });
    }
  }

  hideOpenedModal() {
    const element = document.getElementById('modalDismiss');
    element.click();
  }
}
