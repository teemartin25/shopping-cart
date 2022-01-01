import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { User } from './auth/user.model';
import { DataStorageService } from './data-storage.service';
import { Profile } from './profile.model';
import { RequestsService } from './requests.service';
import Tooltip from 'bootstrap/js/dist/tooltip';
import Modal from 'bootstrap/js/dist/modal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'shopping-cart';
  cartCount: number;
  updatedCurrentProfile: Profile;
  isAuthenticated = false;

  private activatedSub1: Subscription;
  private activatedSub2: Subscription;
  private activatedSub3: Subscription;
  private activatedSub4: Subscription;

  constructor(
    private router: Router,
    private dataStorageService: DataStorageService,
    private requestsService: RequestsService,
    private authService: AuthService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit() {
    this.authService.autoLogin();

    this.activatedSub2 = this.dataStorageService.updatedCartCount.subscribe(
      (cartCount) => {
        this.cartCount = cartCount;
        // console.log('cartcount....');
        // console.log(cartCount);
      }
    );

    this.activatedSub3 =
      this.dataStorageService.updatedCurrentProfile.subscribe(
        (currentProfile) => {
          // console.log(currentProfile);
          if (currentProfile) {
            // console.log('current profile is TRUTHY');
            this.dataStorageService.updateCartCount();
            this.updatedCurrentProfile = currentProfile;
            // console.log(this.updatedCurrentProfile);
          } else {
            // console.log('current profile is FALSY');
            this.updatedCurrentProfile = null;
          }
        }
      );

    this.activatedSub1 = this.authService.user.subscribe((user) => {
      this.isAuthenticated = user ? true : false;
    });

    this.activatedSub4 = this.authService.showAutoLogoutModal.subscribe(
      (autoLogoutModal) => {
        if (autoLogoutModal) {
          this.showAutoLogoutModal();
        } else {
          return;
        }
      }
    );

    this.requestsService.fetchCategories();
    this.requestsService.fetchProducts();
    this.requestsService.fetchProfiles();

    const tooltips = document.querySelectorAll('.tt');

    tooltips.forEach((t) => {
      new Tooltip(t);
    });
  }

  ngOnDestroy() {
    this.activatedSub1.unsubscribe();
    this.activatedSub2.unsubscribe();
    this.activatedSub3.unsubscribe();
    this.activatedSub4.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }

  showAutoLogoutModal() {
    const myModal = document.getElementById('autoLogoutModal');

    const modal = new Modal(myModal);

    modal.show();
  }
}
