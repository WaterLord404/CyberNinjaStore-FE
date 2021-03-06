import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { CartBadgeService } from 'src/app/core/services/cart-badge.service';
import { SnackBarService } from 'src/app/core/services/snack-bar.service';
import { UserI } from 'src/app/modules/account/interfaces/userI';
import { CouponI } from '../../interfaces/coupon';
import { OrderDetailsI } from '../../interfaces/order-details';
import { CheckoutService } from '../../services/checkout.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  ordersDetails: Array<OrderDetailsI>;
  coupon: CouponI;
  totalPrice: number;
  shipping: number;
  user: UserI;
  finalPrice: number;
  discount: number;

  constructor(
    private cartBadgeService: CartBadgeService,
    private orderService: OrderService,
    private snackBarService: SnackBarService,
    private authService: AuthService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {
    this.ordersDetails = [];
    this.shipping = 5.99;
    this.finalPrice = 0;
    this.discount = 0;
    this.user = this.authService.getUser();
    this.checkoutService.getCoupon().subscribe(res => this.coupon = res);
    this.checkoutService.getTotalPrice().subscribe(res => this.totalPrice = res);
    this.checkoutService.getOrdersDetails().subscribe(res => this.ordersDetails = res);
    this.checkoutService.getDiscount().subscribe(res => this.discount = res);
  }

  /**
   * Obtiene la informacion que es pasada desde cart component
   */
  ngOnInit(): void {
    this.finalPrice = this.calculateFinalPrice();
  }

  /**
   * Realiza la compra
   */
  payment(): void {
    this.orderService.buyCart(this.ordersDetails, this.coupon).pipe(finalize(
      () => {
        localStorage.removeItem('__paypal_storage__');
        this.router.navigate(['/']);
      }
    )).subscribe(
      () => {
        this.snackBarService.popup(220);
        this.cartBadgeService.clear();
        this.cartBadgeService.update();
      },
      () => {
        this.snackBarService.popup(500);
      }
    );
  }

  /**
   * Calcula el precio total de cada producto redondeando 2 decimales
   * @param price
   * @param units
   */
   calculatePrice(price: number, units: number): number {
    return Math.round((price * units) * 100) / 100;
  }

  /**
   * Calcula el precio + gastos de envio
   */
  calculateFinalPrice(): number {
    this.finalPrice = (Math.round((this.totalPrice + this.shipping) * 100) / 100);
    return this.finalPrice;
  }
}
