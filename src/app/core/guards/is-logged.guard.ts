import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { SnackBarService } from '../services/snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBarService: SnackBarService
  ) { }

  canActivate(): boolean {
    this.authService.isLoggedIn().subscribe(
      res => {
        if (res === false) {
          this.router.navigate(['/account/login']);
          this.snackBarService.popup(403);
          return false;
        }
      });
    return true;
  }
}
