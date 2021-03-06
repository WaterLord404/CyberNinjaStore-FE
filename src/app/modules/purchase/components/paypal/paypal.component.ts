import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ICreateOrderRequest, ITransactionItem } from 'ngx-paypal';
import { environment } from 'src/environments/environment';
import { OrderDetailsI } from '../../interfaces/order-details';

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.scss']
})
export class PaypalComponent implements OnInit {

  @Input() ordersDetails: Array<OrderDetailsI>;
  @Input() finalPrice = 0;
  @Input() shipping = 0;
  @Input() discount = 0;
  @Input() totalPrice = 0;


  @Output() successful = new EventEmitter<any>();
  activeSpinner = true;

  constructor(private cdref: ChangeDetectorRef) { }

  paypalConfig: any;

  ngOnInit() {
    this.paypalConfig = {
      currency: 'EUR',
      clientId: environment.paypalClientID,
      // tslint:disable-next-line: no-angle-bracket-type-assertion
      createOrderOnClient: (data) => <ICreateOrderRequest>
        {
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'EUR',
                value: this.finalPrice.toString(),
                breakdown: {
                  item_total: {
                    currency_code: 'EUR',
                    value: (Math.round((this.totalPrice + this.discount) * 100) / 100).toString(),
                  },
                  shipping: {
                    currency_code: 'EUR',
                    value: this.shipping.toString()
                  },
                  discount: {
                    currency_code: 'EUR',
                    value: this.discount.toString()
                  }
                }
              },
              items: this.generateItems()
            }
          ],
        },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },

      onApprove: (data, actions) => { },
      onClientAuthorization: data => { this.successful.emit(); },
      onCancel: (data, actions) => { },
      onError: err => { console.log('OnError', err); },
      onClick: (data, actions) => { }
    };
  }

  /**
   * Crea los items para la compra con paypal
   */
  private generateItems(): Array<ITransactionItem> {
    const items: Array<ITransactionItem> = [];

    this.ordersDetails.forEach(element => {

      const item: ITransactionItem = {
        name: element.product.name,
        quantity: element.units.toString(),
        category: 'DIGITAL_GOODS',
        unit_amount: {
          currency_code: 'EUR',
          value: element.product.totalPrice.toString(),
        },
      };

      items.push(item);
    });

    return items;
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
}
