import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { SnackBarService } from 'src/app/core/services/snack-bar.service';
import { UserI } from '../../interfaces/userI';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user: UserI;
  submitted = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private snackBarService: SnackBarService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.user = {
      username: '',
      password: ''
    };
  }

  /**
   * Loguea al usuario en el sistema
   */
  onSubmit(form: FormGroup): void {
    this.submitted = true;
    // stop here if form is invalid
    if (form.invalid) {
      this.snackBarService.popup(300);
      return;
    }

    this.userService.login(this.user).subscribe(
      res => {
        // Guarda al usuario, el estado "logged" y el jwt
        this.authService.login(res.body, res.headers.get('Authorization'));
        this.router.navigate(['/']);
      },

      // Lanza snackBar
      err => {
        switch (err.status) {
          case 403:
            this.snackBarService.popup(301);
            break;
          default:
            this.snackBarService.popup(500);
            break;
        }
      }
    );
  }
}
