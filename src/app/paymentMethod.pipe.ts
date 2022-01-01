import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paymentMethod',
})
export class PaymentMethodPipe implements PipeTransform {
  transform(value: any) {
    if (value === 'debitCard') {
      return 'Debit Card';
    } else if (value === 'creditCard') {
      return 'Credit Card';
    } else {
      return 'Paypal';
    }
  }
}
