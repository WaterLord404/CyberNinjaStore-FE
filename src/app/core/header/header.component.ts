import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthInterceptorService } from '../services/auth-interceptor.service';
import { AuthService } from '../services/auth.service';
import { CommunicationService } from '../services/communication.service';
import { LoaderService } from '../services/loader.service';
import { SnackBarService } from '../services/snack-bar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],

  // Animacion para el menu desplegable
  animations: [
    trigger(
      'inOutAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('200ms ease-in', style({ transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateY(-100%)' }))
      ])]
    )
  ]
})

export class HeaderComponent implements OnInit {

  menuState = false;

  color: ThemePalette = 'warn';
  mode: ProgressBarMode = 'query';
  @Input('matBadge') content: string | undefined;
  isLoading: boolean;

  constructor(
    private communicationService: CommunicationService,
    private loaderService: LoaderService,
    private router: Router,
    protected authService: AuthService,
    private snackBarService: SnackBarService
  ) {
    // Muestra o oculta la barra de loading
    this.loaderService.loading().subscribe(res => this.isLoading = res);

    // Recibe la llamada desde el servicio y actualiza la insignia
    this.communicationService.componentCalled.subscribe(
      res => {
        switch (res) {
          case '+badge':
            this.addOneProductsBadge();
            break;
          case '-badge':
            this.subtractOneProductsBadge();
            break;
        }
      });
  }

  ngOnInit(): void {
    this.content = localStorage.getItem('productsBadge');
  }

  /**
   * Abre y cierra el menu
   */
  openMenu(): void {
    this.menuState = !this.menuState;
  }

  /**
   * Añade 1 a la insignia de los productos
   */
  addOneProductsBadge(): void {
    const data: string = localStorage.getItem('productsBadge');

    if (data == null) {
      localStorage.setItem('productsBadge', '1');
    } else {
      // tslint:disable-next-line: radix
      localStorage.setItem('productsBadge', (parseInt(data) + 1).toString());
    }
    this.content = localStorage.getItem('productsBadge');
  }

  /**
   * Elimina 1 de la insignia de los productos, si esta llega a 0
   * elimina de LocalStorage las insignias y el carrito
   */
  subtractOneProductsBadge(): void {
    const data: string = localStorage.getItem('productsBadge');
    // tslint:disable-next-line: radix
    localStorage.setItem('productsBadge', (parseInt(data) - 1).toString());

    if (data === '1') {
      localStorage.removeItem('productsBadge');
      localStorage.removeItem('cart');
    }
    this.content = localStorage.getItem('productsBadge');
  }

  navigateTo(url: string): void {
    this.menuState = false;
    this.router.navigate([url]);
  }

  /**
   * Cierra la sesión
   */
  logout(): void {
    this.authService.logout();
    this.menuState = false;
    this.router.navigate(['/']);
    this.snackBarService.popup(211);
  }

  /**
   * Comprueba si está logueado el usuario mostrando login | logout
   */
  isLoggedIn(): boolean {
    let status = false;
    this.authService.isLoggedIn().subscribe(
      res => {
        status = res;
      });
    return status;
  }
}
