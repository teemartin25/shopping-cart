import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category } from '../category.model';
import { DataStorageService } from '../data-storage.service';
import { Profile } from '../profile.model';

@Component({
  selector: 'app-edit-category-form',
  templateUrl: './edit-category-form.component.html',
  styleUrls: ['./edit-category-form.component.css'],
})
export class EditCategoryFormComponent implements OnInit, OnDestroy {
  catId: string;
  categories: Category[];
  category: Category;
  addCategoryForm!: FormGroup;
  forbiddenCategoryNames: any = [];
  forbiddenCategoryIds: any = [];
  updatedCurrentProfile: Profile;

  private activatedSub1: Subscription;

  constructor(
    private route: ActivatedRoute,
    private dataStorageService: DataStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.catId = this.route.snapshot.params['id'];
    //console.log(this.catId);

    this.activatedSub1 = this.dataStorageService.updatedCategories.subscribe(
      (updatedCategories) => {
        this.categories = updatedCategories;

        //console.log(this.categories);

        for (const key in updatedCategories) {
          if (updatedCategories.hasOwnProperty(key)) {
            this.forbiddenCategoryNames.push(
              updatedCategories[key].categoryName
            );
            this.forbiddenCategoryIds.push(updatedCategories[key].categoryId);
          }
        }
      }
    );

    this.dataStorageService.triggerModalCloseForAutoLogout.subscribe(
      (trigger) => {
        this.hideOpenedModal();
      }
    );

    this.dataStorageService.getCategories();

    const category = this.categories.find(
      (category) => category.categoryId === this.catId
    );
    this.category = category;

    //  console.log(this.category);
    this.addCategoryForm = new FormGroup({
      categoryName: new FormControl(this.category.categoryName, [
        Validators.required,
        this.forbiddenCategoryName.bind(this),
      ]),
      categoryId: new FormControl(
        this.category.categoryId,
        Validators.required
      ),
    });
  }

  ngOnDestroy() {
    this.activatedSub1.unsubscribe();
  }

  onSubmit() {
    const addedCategoryName = this.addCategoryForm.value.categoryName;
    const addedCategoryId = this.addCategoryForm.value.categoryId;

    this.dataStorageService.editCategories(
      new Category(addedCategoryName, addedCategoryId, this.category.firebaseId)
    );

    //this.addCategoryForm.reset();
    this.router.navigate(['/categories'], { queryParams: { allowEdit: '1' } });

    setTimeout(() => {
      this.dataStorageService.triggerEditCategoryToast.next(
        this.addCategoryForm.value
      );
    }, 200);
  }

  forbiddenCategoryName(control: FormControl): { [s: string]: boolean } {
    const lowercased = this.forbiddenCategoryNames.map((name) =>
      name.toLowerCase()
    );
    const uppercased = this.forbiddenCategoryNames.map((name) =>
      name.toUpperCase()
    );
    const titlecased = this.forbiddenCategoryNames.map(
      (name) => name.charAt(0).toUpperCase() + name.substr(1)
    );
    if (control.value === this.category.categoryName) return null;

    if (
      lowercased.includes(control.value) ||
      uppercased.includes(control.value) ||
      titlecased.includes(control.value)
    ) {
      return { categoryNameIsForbidden: true };
    }
    return null;
  }

  // forbiddenCategoryId(control: FormControl): { [s: string]: boolean } {
  //   if (this.forbiddenCategoryIds.indexOf(control.value) !== -1) {
  //     return { categoryIdIsForbidden: true };
  //   }
  //   return null;
  // }

  hideOpenedModal() {
    const element = document.getElementById('modalDismiss');
    element.click();
  }
}
