import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PayerComponent } from './payer/payer.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SearchingComponent } from './searching/searching.component';
import { CompanyComponent } from './company/company.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PaymentComponent } from './payment/payment.component';
import { BankComponent } from './bank/bank.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SpgModule } from './spg/spg.module'; // import SpgModule
import { SpgRoutingModule } from './spg/spg-routing.module';


@NgModule({
  declarations: [
    AppComponent,
    PayerComponent,
    SearchingComponent,
    CompanyComponent,
    PaymentComponent,
    BankComponent,
    LoginComponent,
    DashboardComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule,
    SpgRoutingModule, 
    SpgModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
