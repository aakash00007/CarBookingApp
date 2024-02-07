import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MessageService } from 'primeng/api';
import { CarService } from 'src/app/services/cars.service';

@Component({
  selector: 'app-booking-modal',
  templateUrl: './booking-modal.component.html',
  styleUrls: ['./booking-modal.component.css'],
})
export class BookingModalComponent implements OnInit {
  header?: string;
  modalevent: EventEmitter<any> = new EventEmitter();
  companies: any[] = [];
  cars: any[] = [];
  bookingForm!: FormGroup;
  selectedCompany: any;
  selectedCar: any;
  selectedOffset?:any;
  constructor(
    public bsModalRef: BsModalRef,
    private messageService: MessageService,
    private router: Router,
    private carService: CarService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.carService.getCompanies().subscribe((res) => {
      this.companies = res.data;
    });

    this.bookingForm = this.formBuilder.group({
      carId: ['', Validators.required],
      companyId: ['', Validators.required],
      fromValid: ['', Validators.required],
      toValid: ['', Validators.required],
      totalFare: [, Validators.required],
    });

    this.bookingForm.get('companyId')?.valueChanges.subscribe((companyId) => {
      this.loadCarsByCompanyId(companyId);
    });

    this.bookingForm.get('carId')?.valueChanges.subscribe((carId) => {
      this.setFromToDatesByCarId(carId);
    });

    this.bookingForm.get('fromValid')?.valueChanges.subscribe(() => {
      this.getTotalFair();
    });

    this.bookingForm.get('toValid')?.valueChanges.subscribe(() => {
      this.getTotalFair();
    });
  }

  loadCarsByCompanyId(companyId: any) {
    if (companyId) {
      this.carService.getCarsByCompanyId(companyId).subscribe((res) => {
        this.cars = res.data.map(
          (car: { name: string; carNumber: string }) => ({
            ...car,
            displayName: car.name + ' ' + car.carNumber,
          })
        );
      });
    } else {
      this.cars = [];
    }
  }

  getTotalFair() {
    const fromDate = new Date(this.bookingForm.get('fromValid')?.value);
    const toDate = new Date(this.bookingForm.get('toValid')?.value);
    const timeDifference = toDate.getTime() - fromDate.getTime();
    const hours = Math.abs(timeDifference / (1000 * 60 * 60));

    const fair: number = this.selectedCar.fair;
    const totalFare: number = fair * hours;
    const formattedTotalFare: string = totalFare.toFixed(2);
    this.bookingForm.patchValue({
      totalFare: formattedTotalFare,
    });

  }

  setFromToDatesByCarId(carId: any) {
    const selectedCar = this.cars.find((car) => car.id == carId);
    if (selectedCar) {
      this.selectedCar = selectedCar;
      const carFromValid = new Date(selectedCar.fromValid);
      const carToValid = new Date(selectedCar.toValid);
      const fromOffsetInMinutes = carFromValid.getTimezoneOffset();
      const adjustedCarFromValid = new Date(carFromValid.getTime() - fromOffsetInMinutes * 60000);
      const toOffsetInMinutes = carFromValid.getTimezoneOffset();
      const adjustedCarToValid = new Date(carToValid.getTime() - toOffsetInMinutes * 60000);
      this.bookingForm.patchValue({
        fromValid: adjustedCarFromValid,
        toValid: adjustedCarToValid,
      });
    } else {
      this.bookingForm.patchValue({
        fromValid: null,
        toValid: null,
      });
      this.selectedCar = null;
    }
  }

  onSubmit() {
    if (this.bookingForm.valid) {
      
      const fromDate = this.bookingForm.get('fromValid')?.value;

      const toDate = this.bookingForm.get('toValid')?.value;
      if (toDate < fromDate) {
        this.messageService.add({
          severity: 'error',
          summary: 'Validation Error',
          detail: 'To Date should be greater than or equal to From Date.',
        });
        return;
      }
      this.selectedOffset = moment.duration(this.selectedOffset).asMinutes();
      this.carService.bookCar(this.selectedOffset,this.bookingForm.value).subscribe({
        next: (res) => {
          this.bookingForm.reset();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Booking Done Successfully',
          });
          this.modalevent.emit('success');
          this.bsModalRef.hide();
        },
        error: (res) => {
          this.messageService.add({
            severity: 'error',
            summary: `${res}`,
            detail: 'Some Error Occured',
          });
        },
      });
    } else {
      this.carService.validateAllFormFields(this.bookingForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Form',
        detail: 'Validations Failed',
      });
    }
  }
}
