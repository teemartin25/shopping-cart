import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Modal from 'bootstrap/js/dist/modal';

@Component({
  selector: 'app-modal-guard-for-checkout-page',
  templateUrl: './modal-guard-for-checkout-page.component.html',
  styleUrls: ['./modal-guard-for-checkout-page.component.css'],
})
export class ModalGuardForCheckoutPageComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    const myModal = document.getElementById('pleaseLoginModal');

    const modal = new Modal(myModal);

    modal.show();
  }

  onGotIt() {
    this.router.navigate(['/']);
  }
}
