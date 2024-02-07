import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MessageService } from 'primeng/api';
import { CarService } from 'src/app/services/cars.service';

@Component({
  selector: 'app-reusable-modal',
  templateUrl: './reusable-modal.component.html',
  styleUrls: ['./reusable-modal.component.css'],
})
export class ReusableModalComponent implements OnInit {
  carForm!: FormGroup;
  companies: any[] = [];
  selectedCompany: any;
  carId?: number;
  header?: string;
  editMode: boolean = false;
  car!:object;
  selectedOffset?:any;
  modalevent: EventEmitter<any> = new EventEmitter();
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

    this.carForm = this.formBuilder.group({
      name: ['', Validators.required],
      carNumber: ['', Validators.required],
      companyId: ['', Validators.required],
      fromValid: ['', Validators.required],
      toValid: ['', Validators.required],
      slots: ['', Validators.required],
      fair: ['', Validators.required],
    });

    if (this.carId) {
      this.editMode = true;
      this.populateCarDetails();
    }
  }

  onAdd() {
    if (this.carForm.valid) {
      const fromDate = this.carForm.get('fromValid')?.value;
      const fromOffsetInMinutes = fromDate.getTimezoneOffset();
      const adjustedFromDate = new Date(
        fromDate.getTime() - fromOffsetInMinutes * 60000
      );
      this.carForm.patchValue({ fromValid: adjustedFromDate });

      const toDate = this.carForm.get('toValid')?.value;
      const toOffsetInMinutes = toDate.getTimezoneOffset();
      const adjustedToDate = new Date(
        toDate.getTime() - toOffsetInMinutes * 60000
      );
      this.carForm.patchValue({ toValid: adjustedToDate });
    
      if (toDate < fromDate) {
        this.messageService.add({
          severity: 'error',
          summary: 'Validation Error',
          detail: 'To Date should be greater than or equal to From Date.'
        });
        return;
      }

      this.selectedOffset = moment.duration(this.selectedOffset).asMinutes();
      this.carService.addCar(this.selectedOffset,this.carForm.value).subscribe({
        next: (res) => {
          this.carForm.reset();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Car Added Successfully',
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
      this.carService.validateAllFormFields(this.carForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Form',
        detail: 'Validations Failed',
      });
    }
  }

  onEdit() {
    if (this.carForm.valid) {
      const fromDate = this.carForm.get('fromValid')?.value;
      const fromOffsetInMinutes = fromDate.getTimezoneOffset();
      const adjustedFromDate = new Date(
        fromDate.getTime() - fromOffsetInMinutes * 60000
      );
      this.carForm.patchValue({ fromValid: adjustedFromDate });

      const toDate = this.carForm.get('toValid')?.value;
      const toOffsetInMinutes = toDate.getTimezoneOffset();
      const adjustedToDate = new Date(
        toDate.getTime() - toOffsetInMinutes * 60000
      );
      this.carForm.patchValue({ toValid: adjustedToDate });

      if (toDate < fromDate) {
        this.messageService.add({
          severity: 'error',
          summary: 'Validation Error',
          detail: 'To Date should be greater than or equal to From Date.'
        });
        return;
      }

      this.selectedOffset = moment.duration(this.selectedOffset).asMinutes();
      this.carService.editCar(this.carId, this.selectedOffset,this.carForm.value).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product Modified Successfully',
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
      this.editMode = false;
    } else {
      this.carService.validateAllFormFields(this.carForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Form',
        detail: 'Validations Failed',
      });
    }
  }

  populateCarDetails() {
    this.carService.getCarById(this.carId).subscribe((res) => {
      this.car = res.data;
      this.carForm.patchValue(res.data);
      const fromValid = new Date(res.data.fromValid);
      const toValid = new Date(res.data.toValid);
      this.carForm.patchValue({
        fromValid: fromValid,
      });
      this.carForm.patchValue({
        toValid: toValid,
      });
    });
  }

  closeModal() {
    if (this.carForm.valid) {
      this.bsModalRef.hide();
    }
  }
}
