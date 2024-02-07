import { Component, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MessageService } from 'primeng/api';
import { CarService } from 'src/app/services/cars.service';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css']
})
export class DeleteModalComponent {
  header?:string;
  carId?:number;
  modalevent: EventEmitter<any> = new EventEmitter();
  constructor(public bsModalRef: BsModalRef,private carService:CarService,private router:Router,private messageService:MessageService){}

  confirmDelete(){
    this.carService.deleteCar(this.carId).subscribe({
      next: (res) =>{
        this.messageService.add({severity: 'success', summary:  'Success', detail: 'Item Deleted Successfully' });
        this.modalevent.emit('success');
        this.bsModalRef.hide();
      },
      error:(res=>{
        this.messageService.add({severity: 'error', summary:  `${res}`, detail: 'Some Error Occured' });
      })
    })
  }
}
