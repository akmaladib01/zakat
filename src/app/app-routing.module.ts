import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayerComponent } from './payer/payer.component';
import { SearchingComponent } from './searching/searching.component';
import { CompanyComponent } from './company/company.component';
import { PaymentComponent } from './payment/payment.component';
import { BankComponent } from './bank/bank.component';

const routes: Routes = [
  { path: '', component: SearchingComponent }, // Default route for the searching page

  // Route for searching (explicit)
  { path: 'search', component: SearchingComponent },

  { path: 'bank/:payerID', component: BankComponent },

  { path: 'payment/:payerID', component: PaymentComponent },

  // Route for the payer page with dynamic parameters
  { path: 'payer/:profileID/:searchValue/:searchField', component: PayerComponent },

  // Route for the company page with dynamic parameters
  { path: 'company/:profileID/:searchValue/:searchField', component: CompanyComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
