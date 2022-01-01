import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataStorageService } from '../data-storage.service';
import { Profile } from '../profile.model';
import Modal from 'bootstrap/js/dist/modal';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.css'],
})
export class CreateProfileComponent implements OnInit, OnDestroy {
  createProfileForm: FormGroup;
  submitted: boolean = false;
  addedProfile: Profile;
  loggedInUser: User;

  private activatedSub1: Subscription;

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.activatedSub1 = this.authService.user.subscribe((user) => {
      this.loggedInUser = user;
    });

    this.createProfileForm = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      address: new FormControl(null, Validators.required),
      imagePath: new FormControl(null, Validators.required),
    });

    this.createProfileForm.patchValue({
      email: this.loggedInUser.email,
    });

    this.openModal();
  }

  ngOnDestroy() {
    this.activatedSub1.unsubscribe();
  }

  onSubmit() {
    this.submitted = true;
    let accessType: string;

    if (this.createProfileForm.value.email.includes('admin')) {
      accessType = 'admin';
    } else {
      accessType = 'non-admin';
    }

    const addedProfile: Profile = new Profile(
      this.createProfileForm.value.firstName,
      this.createProfileForm.value.lastName,
      this.createProfileForm.value.email,
      this.createProfileForm.value.imagePath,
      this.createProfileForm.value.address,
      accessType
    );

    this.createProfileForm.reset();
    //console.log(addedProfile);

    this.dataStorageService.createProfile(addedProfile);
  }

  openModal() {
    const myModal = document.getElementById('createProfileModal');
    const modal = new Modal(myModal);
    modal.show();
  }
}
