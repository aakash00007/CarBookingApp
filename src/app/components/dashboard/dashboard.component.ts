import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { CarService } from 'src/app/services/cars.service';
import { ReusableModalComponent } from '../reusable-modal/reusable-modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as moment from 'moment';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { BookingModalComponent } from '../booking-modal/booking-modal.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public role!: string;
  isTimezoneSelected: boolean = false;
  visible: boolean = false;
  timeZones: any[] = [];
  selectedTimeZone: any;
  selectedTimeZoneOffset: any;
  bsModalRef?: BsModalRef;
  carList!:any;
  currCarId!: string;
  bookings:any[]=[];
  userId!:string;

  constructor(private authService: AuthService,
    private carService: CarService,
    private messageService: MessageService,
    private modalService: BsModalService){}
  
    ngOnInit(): void {
    this.carService.getRoleFromStorage().subscribe((val) => {
      let roleFromToken = this.authService.getRoleFromToken();
      this.role = val || roleFromToken;
    });

    this.carService.getIdFromStorage().subscribe((val) => {
      let idFromToken = this.authService.getIdFromToken();
      this.userId = val || idFromToken;
    });

    this.getBookingList();

    this.carService.getTimeZones().subscribe((res) => {
      res.data.forEach((element: object) => {
        this.timeZones.push(element);
      });
      this.visible = true;
    });

    this.getCarList();
  }

  getCarList(){
    this.carService.getCars().subscribe((res) =>{
      this.carList = res.data;
      this.carList.forEach((element: any) => {
        element.fromValid = moment(element.fromValid).subtract(this.selectedTimeZone.utcOffSet,'h').format(
          'YYYY-MM-DD hh:mm A'
        );
        element.toValid = moment(element.toValid).subtract(this.selectedTimeZone.utcOffSet,'h').format(
          'YYYY-MM-DD hh:mm A'
        );
      });
    })
  }

  getBookingList(){
    this.carService.getBookingsByUserId(this.userId).subscribe((res) =>{
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
  }


  onSave() {
    if(this.selectedTimeZone == null || this.selectedTimeZone == ""){
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please select a value for timezone.'
      });
      return;
    }
    if(this.selectedTimeZone) {
      this.selectedTimeZoneOffset = this.selectedTimeZone.utcOffSet;
      this.carList.forEach((element: any) => {
        element.fromValid = moment(element.fromValid).subtract(this.selectedTimeZone.utcOffSet,'h').format('YYYY-MM-DD hh:mm A');
        element.toValid = moment(element.toValid).subtract(this.selectedTimeZone.utcOffSet,'h').format('YYYY-MM-DD hh:mm A');
      });
    }

    this.isTimezoneSelected = true;
  }

  openAddModal(){
    const initialState = {
      header:'Add Car',
      selectedOffset : this.selectedTimeZoneOffset
    }
    this.bsModalRef = this.modalService.show(ReusableModalComponent, {initialState
    });
    this.bsModalRef.content.modalevent.subscribe((res:string) =>{
      if(res == "success"){
        this.getCarList();
      }
    })
  }

  openEditModal(id:number){
    const initialState = {
      carId: id,
      header:'Edit Car',
      selectedOffset : this.selectedTimeZoneOffset
    };

    this.bsModalRef = this.modalService.show(ReusableModalComponent, {
      initialState,
    });

    this.bsModalRef.content.modalevent.subscribe((res:string) =>{
      if(res == "success"){
        this.getCarList();
      }
    })
  }

  openDeleteModal(id:number){
    const initialState = {
      carId: id,
      header:'Car'
    };
    this.bsModalRef = this.modalService.show(DeleteModalComponent, {
      initialState,
    });

    this.bsModalRef.content.modalevent.subscribe((res:string) =>{
      if(res == "success"){
        this.getCarList();
      }
    })
  }

  openBookingModal(){
    const initialState = {
      header:'Add Booking',
      selectedOffset:this.selectedTimeZoneOffset
    }
    this.bsModalRef = this.modalService.show(BookingModalComponent,{initialState});
    this.bsModalRef.content.modalevent.subscribe((res:string) =>{
      if(res == "success"){
        this.getBookingList();
      }
    })
  }
}
