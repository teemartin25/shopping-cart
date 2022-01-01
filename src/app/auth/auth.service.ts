import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DataStorageService } from '../data-storage.service';
import { RequestsService } from '../requests.service';
import { User } from './user.model';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  showAutoLogoutModal = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private dataStorageService: DataStorageService,
    private requestsService: RequestsService
  ) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCsBdn7ko9gfo8Yzr6Z3SST4UyUyb0TOLs',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCsBdn7ko9gfo8Yzr6Z3SST4UyUyb0TOLs',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occured!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct';
        break;
    }
    return throwError(errorMessage);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  logout() {
    this.user.next(null);
    // console.log('logging out...');
    this.dataStorageService.updatedCurrentProfile.next(null);
    this.dataStorageService.emptyCart();
    this.dataStorageService.updatedCartCount.next(null);
    this.dataStorageService.emptyOrderHistory();

    this.router.navigate(['']);
    localStorage.removeItem('userData');

    this.requestsService.fetchCategories();
    this.requestsService.fetchProducts();
    this.requestsService.fetchProfiles();

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.dataStorageService.triggerModalCloseForAutoLogout.next(true)
      this.logout();
      this.showAutoLogoutModal.next(true);
    }, expirationDuration);
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) return;

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);

      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();

      this.autoLogout(expirationDuration);

      this.syncLoggedInEmailAsCurrentProfile();
    }
  }

  getAuthenticatedUser() {
    return new Promise((resolve, reject) => {
      this.user.subscribe((authenticatedUser) => {
        if (authenticatedUser) resolve(authenticatedUser);
      });
    });
  }

  getProfiles() {
    return new Promise((resolve, reject) => {
      this.requestsService.fetchProfiles();
      this.requestsService.updatedProfiles.subscribe((updatedProfiles) => {
        if (updatedProfiles.length > 0) resolve(updatedProfiles);
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

      this.dataStorageService.updatedCurrentProfile.next(currentUpdatedProfile);
      this.dataStorageService.orderHistory = currentUpdatedProfile.orderHistory;
      this.dataStorageService.cart = currentUpdatedProfile.cart;
      this.dataStorageService.updatedCart.next(currentUpdatedProfile.cart);
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
