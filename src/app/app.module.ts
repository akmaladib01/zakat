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
import { BayarComponent } from './bayar/bayar.component';

@NgModule({
  declarations: [
    AppComponent,
    PayerComponent,
    SearchingComponent,
    CompanyComponent,
    PaymentComponent,
    BayarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
