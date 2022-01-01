import { Component, OnDestroy, OnInit, Pipe } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DataStorageService } from '../data-storage.service';
import { RequestsService } from '../requests.service';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private dataStorageService: DataStorageService,
    private requestsService: RequestsService
  ) {}

  isLoginMode = true;
  isLoading = false;
  error: string = null;

  ngOnInit(): void {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return; // Simple Guard Clause

    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    this.error = null;
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe(
      (resData) => {
        // console.log(resData);
        this.isLoading = false;

        this.dataStorageService.emptyCart();
        this.dataStorageService.updatedCartCount.next(null);
        this.syncLoggedInEmailAsCurrentProfile();
      },
      (errorMessage) => {
        //  console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    );

    //console.log(form.value);
    form.reset();
  }

  getAuthenticatedUser() {
    return new Promise((resolve, reject) => {
      this.authService.user.subscribe((authenticatedUser) => {
        if (authenticatedUser) resolve(authenticatedUser);
      });
    });
  }

  getProfiles() {
    return new Promise((resolve, reject) => {
      this.requestsService.updatedProfiles.subscribe((updatedProfiles) => {
        if (updatedProfiles) resolve(updatedProfiles);
      });
    });
  }

  async syncLoggedInEmailAsCurrentProfile() {
    const data: any = await Promise.all([
      this.getAuthenticatedUser(),
      this.getProfiles(),
    ]);

    const [authenticatedUser, updatedProfiles] = data;

    // console.log(authenticatedUser);
    // console.log(updatedProfiles);

    const index = updatedProfiles.findIndex(
      (profile) => profile.email === authenticatedUser.email
    );

    //console.log(index);

    if (index === -1) {
      this.router.navigate(['/create-profile']);
    } else {
      const currentUpdatedProfile = updatedProfiles.find(
        (profile) => profile.email === authenticatedUser.email
      );
      // console.log(currentUpdatedProfile);
      this.dataStorageService.updatedCurrentProfile.next(currentUpdatedProfile);

      if (currentUpdatedProfile.orderHistory) {
        this.dataStorageService.orderHistory =
          currentUpdatedProfile.orderHistory;
      } else {
        this.dataStorageService.orderHistory = [];
      }

      // console.log(currentUpdatedProfile.accessType);
      this.router.navigate(['/categories'], {
        queryParams: {
          allowEdit: currentUpdatedProfile.accessType === 'admin' ? '1' : '0',
        },
      });

      //console.log(currentUpdatedProfile.cart);
      this.dataStorageService.updatedCart.next(currentUpdatedProfile.cart);
      this.dataStorageService.updateCartCount();
    }
  }
}
