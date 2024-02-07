import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { CarService } from 'src/app/services/cars.service';

@Component({
  selector: 'app-booking-listing',
  templateUrl: './booking-listing.component.html',
  styleUrls: ['./booking-listing.component.css']
})
export class BookingListingComponent implements OnInit {
  bookings:any[] = [];
  public role!: string;
  constructor(private authService:AuthService,private carService:CarService,private messageService:MessageService){}
  ngOnInit(): void {
    this.carService.getBookings().subscribe((res) =>{
      this.bookings = res.data;
      this.bookings.forEach((element: any) => {
        element.fromValid = moment(element.fromValid).format(
          'YYYY-MM-DD hh:mm A'
        );
        element.toValid = moment(element.toValid).format(
          'YYYY-MM-DD hh:mm A'
        );
      });
    })

    this.carService.getRoleFromStorage().subscribe((val) => {
      let roleFromToken = this.authService.getRoleFromToken();
      this.role = val || roleFromToken;
    });
  }
}
