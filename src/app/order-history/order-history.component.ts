import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataStorageService } from '../data-storage.service';
import { Profile } from '../profile.model';
import { Order } from './order.model';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
})
export class OrderHistoryComponent implements OnInit, OnDestroy {
  currentProfile: Profile;
  orders: Order[];

  private activatedSub1: Subscription;

  constructor(private dataStorageService: DataStorageService) {}

  ngOnInit(): void {
    this.activatedSub1 =
      this.dataStorageService.updatedCurrentProfile.subscribe(
        (updatedCurrentProfile) => {
          if (!updatedCurrentProfile) return;
          this.currentProfile = updatedCurrentProfile;
          this.orders = updatedCurrentProfile.orderHistory;
        }
      );
    // console.log(this.currentProfile);
    // console.log(this.orders);
    //
  }

  ngOnDestroy() {
    this.activatedSub1.unsubscribe();
  }
}
