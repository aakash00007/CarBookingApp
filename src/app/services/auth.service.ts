import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/Environments/environment';
import { LoginModel } from '../models/loginmodel';
import { ApiResponse } from '../models/apiresponse';
import { SignupModel } from '../models/signupmodel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private payload:any;

  constructor(private httpClient: HttpClient, private router: Router) { 
    this.payload = this.getPayLoadFromToken();
  }

  signUp(signupObj: SignupModel) {
    return this.httpClient.post<ApiResponse>(`${environment.baseUrl}/api/Auth/Register`, signupObj);
  }

  login(loginObj: LoginModel) {
    debugger
    return this.httpClient.post<ApiResponse>(`${environment.baseUrl}/api/Auth/Login`, loginObj);
  }

  logout() {
    localStorage.clear()
    this.router.navigate(['login']);
  }

  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getPayLoadFromToken() {
    const jwtHelper = new JwtHelperService();
    const storedToken = this.getToken()!;
    return jwtHelper.decodeToken(storedToken);
  }

  getNameFromToken() {
    if (this.payload) {
      return this.payload.name;
    }
  }

  getIdFromToken(){
    if(this.payload){
      return this.payload.id;
    }
  }

  getRoleFromToken() {
    if (this.payload) {
      return this.payload.role;
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }


}
