import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category } from '../category.model';
import { DataStorageService } from '../data-storage.service';
import { RequestsService } from '../requests.service';

@Component({
  selector: 'app-add-category-form',
  templateUrl: './add-category-form.component.html',
  styleUrls: ['./add-category-form.component.css'],
})
export class AddCategoryFormComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  addCategoryForm!: FormGroup;
  forbiddenCategoryNames: any = [];
  forbiddenCategoryIds: any = [];

  private activatedSub1: Subscription;

  constructor(
    private dataStorageService: DataStorageService,
    private requestsService: RequestsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedSub1 = this.dataStorageService.updatedCategories.subscribe(
      (updatedCategories) => {
        this.categories = updatedCategories;

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

    //console.log(this.forbiddenCategoryNames);
    //console.log(this.forbiddenCategoryIds);

    this.dataStorageService.getCategories();

    this.addCategoryForm = new FormGroup({
      categoryName: new FormControl(null, [
        Validators.required,
        this.forbiddenCategoryName.bind(this),
      ]),
      categoryId: new FormControl(null, [
        Validators.required,
        this.forbiddenCategoryId.bind(this),
      ]),
    });
  }

  ngOnDestroy() {
    this.activatedSub1.unsubscribe();
  }

  onSubmit() {
    const addedCategoryName = this.addCategoryForm.value.categoryName;
    const addedCategoryId = this.addCategoryForm.value.categoryId;

    this.dataStorageService.addToCategories(
      new Category(addedCategoryName, addedCategoryId)
    );

    this.addCategoryForm.reset();
    this.router.navigate(['/categories'], { queryParams: { allowEdit: '1' } });

    setTimeout(() => {
      this.dataStorageService.triggerAddCategoryToast.next(
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

    if (
      lowercased.includes(control.value) ||
      uppercased.includes(control.value) ||
      titlecased.includes(control.value)
    ) {
      return { categoryNameIsForbidden: true };
    }
    return null;
  }

  forbiddenCategoryId(control: FormControl): { [s: string]: boolean } {
    const lowercased = this.forbiddenCategoryIds.map((id) => id.toLowerCase());
    const uppercased = this.forbiddenCategoryIds.map((id) => id.toUpperCase());
    const titlecased = this.forbiddenCategoryIds.map(
      (id) => id.charAt(0).toUpperCase() + id.substr(1)
    );

    if (
      lowercased.includes(control.value) ||
      uppercased.includes(control.value) ||
      titlecased.includes(control.value)
    ) {
      return { categoryIdIsForbidden: true };
    }
    return null;
  }

  hideOpenedModal() {
    const element = document.getElementById('modalDismiss');
    element.click();
  }
}
//
