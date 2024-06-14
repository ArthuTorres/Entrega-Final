import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../_shared/services/auth.service';
import { LoginRequest } from '../../../_shared/models/auth.models';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  loginForm = this.formBuilder.group({
    "email": this.formBuilder.control("", [Validators.required, Validators.email]),
    "password": this.formBuilder.control("", [Validators.required]),
  })

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }

  async login() {
    const payload = <LoginRequest>this.loginForm.value
    await firstValueFrom(this.authService.login(payload))
  }
}
