import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';

// Components
import { SearchCompanyComponent } from './search-company/search-company.component';
import { RegisterCompanyComponent } from './register-company/register-company.component';
import { PaymentComponent } from './payment-process/payment-process.component';
import { ReceiptComponent } from './receipt/receipt.component';

// Routing Module
import { SpgRoutingModule } from './spg-routing.module';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    SearchCompanyComponent,
    RegisterCompanyComponent,
    PaymentComponent,
    ReceiptComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatListModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatOptionModule,
    SpgRoutingModule,
    ReactiveFormsModule
  ],
  exports: [
    SearchCompanyComponent,
    RegisterCompanyComponent,
    PaymentComponent,
    ReceiptComponent,
  ],
})
export class SpgModule {}
