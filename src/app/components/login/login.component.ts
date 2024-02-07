import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { CarService } from 'src/app/services/cars.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private carService: CarService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }

  onLogin() {
    if (this.loginForm.valid) {
      debugger
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.loginForm.reset();
          this.authService.storeToken(res.data);
          const payload = this.authService.getPayLoadFromToken();

          this.carService.setNameToStorage(payload.name);
          this.carService.setRoleToStorage(payload.role);
          this.carService.setIdToStorage(payload.id);

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Logged In Successfully',
          });
          this.router.navigate(['dashboard']);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Credentials Failed!',
            detail: 'Please Check Your Password!',
          });
        },
      });
    } else {
      this.carService.validateAllFormFields(this.loginForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Form',
        detail: 'Validations Failed',
      });
    }
  }
}
