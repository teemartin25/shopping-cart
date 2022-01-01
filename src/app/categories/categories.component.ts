import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Category } from '../category.model';
import { DataStorageService } from '../data-storage.service';
import Modal from 'bootstrap/js/dist/modal';
import { Profile } from '../profile.model';
import Toast from 'bootstrap/js/dist/toast';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  allowEdit: boolean = false;
  addCategoryButtonClicked: boolean = false;
  editCategoryButtonClicked: boolean = false;
  deletedCategory: Category;
  addCategoryForm!: FormGroup;
  forbiddenCategoryNames: any = [];
  forbiddenCategoryIds: any = [];
  updatedCurrentProfile: Profile;

  private activatedSub1: Subscription;
  private activatedSub2: Subscription;
  private activatedSub3: Subscription;
  private activatedSub4: Subscription;
  private activatedSub5: Subscription;

  constructor(
    private dataStorageService: DataStorageService,
    private route: ActivatedRoute
  ) {}

  @ViewChild('myToast1', { static: true })
  toastEl1!: ElementRef<HTMLDivElement>;
  editToast: Toast | null = null;

  @ViewChild('myToast2', { static: true })
  toastEl2!: ElementRef<HTMLDivElement>;
  deleteToast: Toast | null = null;

  @ViewChild('myToast3', { static: true })
  toastEl3!: ElementRef<HTMLDivElement>;
  addToast: Toast | null = null;

  @ViewChild('myToast4', { static: true })
  toastEl4!: ElementRef<HTMLDivElement>;
  editedProfileToast: Toast | null = null;

  ngOnInit(): void {
    //('first part categories component');

    this.activatedSub1 = this.dataStorageService.updatedCategories.subscribe(
      (updatedCategories) => {
        this.categories = updatedCategories;
      }
    );

    this.dataStorageService.getCategories();

    this.route.queryParams.subscribe((queryParams: Params) => {
      this.allowEdit = queryParams['allowEdit'] === '1' ? true : false;
    });

    this.activatedSub3 =
      this.dataStorageService.updatedCurrentProfile.subscribe(
        (currentProfile) => {
          this.updatedCurrentProfile = currentProfile;
          //  console.log(this.updatedCurrentProfile);
        }
      );

    this.activatedSub4 =
      this.dataStorageService.triggerEditCategoryToast.subscribe((trigger) => {
        // console.log(trigger);
        // console.log(this.updatedCurrentProfile);

        this.showEditToast();
      });

    this.activatedSub5 =
      this.dataStorageService.triggerAddCategoryToast.subscribe((trigger) => {
        //   console.log(trigger);

        this.showAddToast();
      });

    this.activatedSub2 =
      this.dataStorageService.triggerEditedProfileToastCategoriesPage.subscribe(
        (trigger) => {
          this.updatedCurrentProfile = trigger;
          this.showEditedProfileToast();
        }
      );

    this.dataStorageService.triggerModalCloseForAutoLogout.subscribe(
      (trigger) => {
        this.hideOpenedModal();
      }
    );

    this.editToast = new Toast(this.toastEl1.nativeElement, {});
    this.deleteToast = new Toast(this.toastEl2.nativeElement, {});
    this.addToast = new Toast(this.toastEl3.nativeElement, {});
    this.editedProfileToast = new Toast(this.toastEl4.nativeElement, {});
  }

  ngOnDestroy() {
    this.activatedSub1.unsubscribe();
    this.activatedSub2.unsubscribe();
    this.activatedSub3.unsubscribe();
    this.activatedSub4.unsubscribe();
    this.activatedSub5.unsubscribe();
  }

  onDelete(deletedCategory: Category) {
    this.deletedCategory = deletedCategory;
  }

  onModalDelete() {
    this.dataStorageService.deleteFromCategories(this.deletedCategory);
    this.showDeleteToast();
  }

  addCategoryClicked() {
    this.addCategoryButtonClicked = !this.addCategoryButtonClicked;
  }

  onEdit(categoryToEdit: Category) {
    // console.log(categoryToEdit);
    this.editCategoryButtonClicked = !this.editCategoryButtonClicked;

    //This SetTimeout is a workaround so that the Button on our template gets clicked AFTER the necessary route has been loaded.
    setTimeout(() => {
      const element = document.getElementById('editModalTrigger');
      element.click();
    }, 1);

    //Approach below will also work but the backdrop is darker than usual.
    // setTimeout(() => {
    //   const myModal = document.getElementById('editCategory');
    //   const modal = new Modal(myModal);

    //   modal.show();
    // }, 1);
    //
  }

  onAdd() {
    setTimeout(() => {
      const element = document.getElementById('editModalTrigger');
      element.click();
    }, 1);
  }

  showEditToast() {
    this.editToast!.show();
  }

  showDeleteToast() {
    setTimeout(() => {
      this.deleteToast!.show();
    }, 200);
  }

  showAddToast() {
    setTimeout(() => {
      this.addToast!.show();
    }, 200);
  }

  showEditedProfileToast() {
    this.editedProfileToast!.show();
  }

  hideOpenedModal() {
    const element = document.getElementById('modalDismiss');
    element.click();
  }
}
