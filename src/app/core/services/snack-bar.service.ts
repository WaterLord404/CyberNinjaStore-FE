import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private snackBar: MatSnackBar) { }

  /**
   * Crea un SnakBar con un mensaje
   * @param msg
   */
  popup(option: number, message?: string): void {
    let msg = this.getError(option);
    if (message !== undefined) { msg = message; }

    this.snackBar.open(msg, '', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  private getError(option: number): string {
    let error = '';
    switch (option) {
      case 203:
        error = 'Successfully removed';
        break;
      case 201:
        error = 'Successfully created';
        break;
      case 205:
        error = 'Successfully updated';
        break;
      case 210:
        error = 'Successfully login';
        break;
      case 211:
        error = 'Successfully logout';
        break;
      case 212:
        error = 'Successfully registration';
        break;
      case 213:
        error = 'Check your email to confirm your account';
        break;
      case 214:
        error = 'Thanks for rating !';
        break;
      case 215:
        error = 'Successfully returned';
        break;
      case 220:
        error = 'Successfully purchase';
        break;
      case 300:
        error = 'The form contains errors';
        break;
      case 301:
        error = 'The username and password you entered did not match our records';
        break;
      case 302:
        error = 'Username not available';
        break;
      case 303:
        error = 'Email not available';
        break;
      case 403:
        error = 'Access denied';
        break;
      case 409:
        error = 'You already returned this product';
        break;
      case 410:
        error = 'You already valued this product';
        break;
      case 500:
        error = 'Something went wrong';
        break;
      case 800:
        error = 'One product in your cart now does not exist';
        break;
      case 801:
        error = 'Invalid coupon';
        break;
      case 802:
        error = 'Please select product details';
        break;
      default:
        error = 'Unknown error';
        break;
    }
    return error;
  }
}
