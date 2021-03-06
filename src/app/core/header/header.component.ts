import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { CartBadgeService } from 'src/app/core/services/cart-badge.service';
import { CartService } from 'src/app/modules/purchase/services/cart.service';
import { AuthService } from '../services/auth.service';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger(
      'inOutAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('250ms ease-in', style({ transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [
        animate('250ms ease-out', style({ transform: 'translateY(-100%)' }))
      ])]
    ),
    trigger('rotatedState', [
      transition(':enter', [
        style({ display: 'none' }),
        animate('200ms ease-in')
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ transform: 'rotate(180deg)', opacity: '0.8' }))
      ]),
    ])
  ]
})

export class HeaderComponent implements OnInit {

  isMenuActive = false;

  color: ThemePalette = 'warn';
  mode: ProgressBarMode = 'query';
  @Input('matBadge') cartBadgeCount: string | undefined;
  isLoading: boolean;

  constructor(
    private loaderService: LoaderService,
    public router: Router,
    protected authService: AuthService,
    private cartBadgeService: CartBadgeService,
    private cartService: CartService,
    private dialog: MatDialog
  ) {
    // Muestra o oculta la barra de loading
    this.loaderService.loading().subscribe(res => this.isLoading = res);
    this.cartBadgeService.getCartBadgeCount().subscribe(res => this.cartBadgeCount = res);
    this.router.events.subscribe(() => this.isMenuActive = false);
  }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  /**
   * Guarda el carrito y cierra la sesión
   */
  logout(): void {
    this.cartService.saveCart();
    this.router.navigate(['/']);
    window.scroll(0, 0);
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }
}
