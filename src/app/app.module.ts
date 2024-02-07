import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HeaderComponent } from './components/header/header.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReusableModalComponent } from './components/reusable-modal/reusable-modal.component';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { AccordionModule } from 'ngx-bootstrap/accordion'
import { ModalModule,BsModalService} from 'ngx-bootstrap/modal';
import { DeleteModalComponent } from './components/delete-modal/delete-modal.component';
import { BookingModalComponent } from './components/booking-modal/booking-modal.component';
import { BookingListingComponent } from './components/booking-listing/booking-listing.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HeaderComponent,
    DashboardComponent,
    ReusableModalComponent,
    DeleteModalComponent,
    BookingModalComponent,
    BookingListingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CalendarModule,
    DialogModule,
    DropdownModule,
    CommonModule,
    ToastModule,
    ButtonModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DynamicDialogModule,
    AccordionModule.forRoot(),
    ModalModule
  ],
  providers: [
    MessageService,
    BsModalService,
    DialogService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
