import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/Environments/environment';
import { ApiResponse } from '../models/apiresponse';
import { CarModel } from '../models/carmodel';
import { BookingModel } from '../models/bookingmodel';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private name$ = new BehaviorSubject<string>("");
  private role$ = new BehaviorSubject<string>("");
  private id$ = new BehaviorSubject<string>("");
  constructor(private httpClient:HttpClient,private router:Router) { }

  public getRoleFromStorage(){
    return this.role$.asObservable();
  }

  public getIdFromStorage(){
    return this.id$.asObservable();
  }

  public setIdToStorage(id:string){
    this.id$.next(id);
  }

  public setRoleToStorage(role:string){
    this.role$.next(role);
  }

  public getNameFromStorage(){
    return this.name$.asObservable();
  }

  public setNameToStorage(name:string){
    this.name$.next(name);
  }

  getCompanies(){
    return this.httpClient.get<ApiResponse>(`${environment.baseUrl}/api/Car/GetCompanies`);
  }

  getTimeZones(){
    return this.httpClient.get<ApiResponse>(`${environment.baseUrl}/api/Car/GetTimeZones`)
  }

  getCars(){
    return this.httpClient.get<ApiResponse>(`${environment.baseUrl}/api/Car/GetCars`)
  }

  getCarById(id:number|undefined){
    return this.httpClient.get<ApiResponse>(`${environment.baseUrl}/api/Car/GetCarById/` + id);
  }

  getCarsByCompanyId(id:number|undefined){
    return this.httpClient.get<ApiResponse>(`${environment.baseUrl}/api/Car/GetCarsByCompanyId/` + id)
  }

  getBookings(){
    return this.httpClient.get<ApiResponse>(`${environment.baseUrl}/api/Booking/GetAllBookings`);
  }

  getBookingsByUserId(id:string){
    return this.httpClient.get<ApiResponse>(`${environment.baseUrl}/api/Booking/GetBookingsByUserId/`+id)
  }

  addCar(offset:number,carObj:CarModel){
    return this.httpClient.post<ApiResponse>(`${environment.baseUrl}/api/Car/AddCar/`+ offset,carObj)
  }

  editCar(id:number | undefined,offset:number,carObj:CarModel){
    return this.httpClient.put<ApiResponse>(`${environment.baseUrl}/api/Car/UpdateCar/` + id+`?offset=${offset}` ,carObj)
  }

  deleteCar(id:number | undefined){
    return this.httpClient.delete<ApiResponse>(`${environment.baseUrl}/api/Car/DeleteCar/`+ id)
  }

  bookCar(offset:number,bookingObj:BookingModel){
    return this.httpClient.post<ApiResponse>(`${environment.baseUrl}/api/Booking/BookCar/` + offset,bookingObj);
  }

  public validateAllFormFields(formGroup:FormGroup){
    Object.keys(formGroup.controls).forEach(field =>{
      const control = formGroup.get(field);
      if(control instanceof FormControl){
        control.markAsDirty({onlySelf:true})
      }
      else if(control instanceof FormGroup){
        this.validateAllFormFields(control);
      }
    })
  }
}
