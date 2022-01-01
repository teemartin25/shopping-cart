import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataStorageService } from '../data-storage.service';
import { Profile } from '../profile.model';
import Modal from 'bootstrap/js/dist/modal';

import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit, OnDestroy {
  editProfileForm: FormGroup;
  editedProfile: Profile;
  currentProfile: Profile;
  updatedProfiles: Profile[];

  private activatedSub1: Subscription;

  constructor(
    private dataStorageService: DataStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dataStorageService.getProfiles();

    this.activatedSub1 =
      this.dataStorageService.updatedCurrentProfile.subscribe(
        (currentProfile) => {
          this.currentProfile = currentProfile;
        }
      );

    this.dataStorageService.triggerModalCloseForAutoLogout.subscribe(
      (trigger) => {
        if (trigger) this.hideOpenedModal();
      }
    );

    this.editProfileForm = new FormGroup({
      firstName: new FormControl(
        this.currentProfile.firstName,
        Validators.required
      ),
      lastName: new FormControl(
        this.currentProfile.lastName,
        Validators.required
      ),
      email: new FormControl(this.currentProfile.email, [
        Validators.required,
        Validators.email,
      ]),
      address: new FormControl(
        this.currentProfile.address,
        Validators.required
      ),
      imagePath: new FormControl(
        this.currentProfile.imagePath,
        Validators.required
      ),
    });

    this.openModal();
  }

  ngOnDestroy() {
    this.activatedSub1.unsubscribe();
  }

  onSubmit() {
    let accessType: string;

    if (this.editProfileForm.value.email.includes('admin')) {
      accessType = 'admin';
    } else {
      accessType = 'non-admin';
    }

    const editedProfile: Profile = new Profile(
      this.editProfileForm.value.firstName,
      this.editProfileForm.value.lastName,
      this.editProfileForm.value.email,
      this.editProfileForm.value.imagePath,
      this.editProfileForm.value.address,
      accessType,
      this.currentProfile.firebaseId
    );

    this.editProfileForm.reset();

    // console.log(editedProfile);
    this.dataStorageService.editProfile(editedProfile);
    this.router.navigate(['/categories'], {
      queryParams: {
        allowEdit: this.currentProfile.accessType === 'admin' ? '1' : '0',
      },
    });

    setTimeout(() => {
      this.dataStorageService.triggerEditedProfileToastCategoriesPage.next(
        editedProfile
      );
    }, 200);
  }

  openModal() {
    const myModal = document.getElementById('editProfileModal');
    const modal = new Modal(myModal);
    modal.show();
  }

  onModalClose() {
    this.router.navigate(['/categories'], {
      queryParams: {
        allowEdit: this.currentProfile.accessType === 'admin' ? '1' : '0',
      },
    });
  }

  // For autologout bug where it doesn't close the modal when session has expired
  hideOpenedModal() {
    // console.log('hidee');
    const element = document.getElementById('modalDismiss');
    element.click();
  }
}
