import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchCompanyComponent } from './search-company/search-company.component';
import { RegisterCompanyComponent } from './register-company/register-company.component';
import { PaymentComponent } from './payment-process/payment-process.component';
import { ReceiptComponent } from './receipt/receipt.component';

const routes: Routes = [
  { path: 'search-company', component: SearchCompanyComponent },
  { path: 'register-company', component: RegisterCompanyComponent },
  { path: 'payment-process', component: PaymentComponent },
  { path: 'receipt', component: ReceiptComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpgRoutingModule { }
