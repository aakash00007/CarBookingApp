import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { CarService } from 'src/app/services/cars.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  type:string = "password";
  isText:boolean = false;
  eyeIcon:string = "fa-eye-slash";
  signupForm!: FormGroup;

  constructor(private formBuilder:FormBuilder, private authService:AuthService,private carService:CarService, private router:Router,private messageService:MessageService){}

  ngOnInit() : void{
    this.signupForm = this.formBuilder.group({
      username: ['',Validators.required],
      email: ['',Validators.required],
      password: ['',Validators.required],
      confirmPassword: ['',Validators.required]
    })
  }

  hideShowPass(){
    this.isText = !this.isText;
    this.isText? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText? this.type = "text" : this.type = "password";
  }

  onSignup(){
    if(this.signupForm.valid){
      this.authService.signUp(this.signupForm.value).subscribe({
        next:(res => {
          this.messageService.add({severity: 'success', summary:  'Success', detail: 'User Registered Successfully!' });
          this.signupForm.reset();
          this.router.navigate(['login']);
        }),
        error:(err => {
          this.messageService.add({severity: 'error', summary:  `${err.message}`, detail: 'Some Error Occured' });
        })
      })
    }
    else{
      this.carService.validateAllFormFields(this.signupForm);
      this.messageService.add({severity: 'error', summary:  'Invalid Form', detail: 'Validations Failed' });
    }
  }
}
