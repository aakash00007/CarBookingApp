import { Component, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { CarService } from 'src/app/services/cars.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() timeZone!:any;
  public name: string = '';
  public role!: string;
  timeZoneName!:string;

  constructor(
    private authService: AuthService,
    private carService: CarService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.carService.getNameFromStorage().subscribe((val) => {
      let nameFromToken = this.authService.getNameFromToken();
      this.name = val || nameFromToken;
    });

    this.carService.getRoleFromStorage().subscribe((val) => {
      let roleFromToken = this.authService.getRoleFromToken();
      this.role = val || roleFromToken;
    });
  }
  signOut() {
    this.authService.logout();
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Logged Out Successfully',
    });
  }
}
