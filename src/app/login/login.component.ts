import {FormBuilder, Validators} from '@angular/forms';

import {AlertService} from '@shared/services';
import {AuthService} from '@core/auth.service';
import {Component} from '@angular/core';
import {ERROR_MESSAGES} from '@core/constants/error-messages';
import {GetToken} from '@core/models';
import {Router} from '@angular/router';
import {ValidateEmail} from '@core/utils';

const UNAUTHORIZED_STATUS = 401;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form = this.fb.group({
    email: [null, [Validators.required, ValidateEmail]],
    password: [null, [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService,
  ) {}

  handleSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    const payload = new GetToken(this.form.value.email);
    this.authService.login(payload).subscribe({
      next: ({token}) => {
        if (token) {
          this.router.navigate(['/']);
        }
      },
      error: error => {
        if (error.status === UNAUTHORIZED_STATUS) {
          this.alertService.open({
            type: 'error',
            message: ERROR_MESSAGES['invalidCredentials'],
          });
        }
      },
    });
  }
}
