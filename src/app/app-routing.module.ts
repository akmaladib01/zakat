import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PayerComponent } from './payer/payer.component';
import { SearchingComponent } from './searching/searching.component';
import { CompanyComponent } from './company/company.component';
import { PaymentComponent } from './payment/payment.component';
import { BankComponent } from './bank/bank.component';
import { SearchCompanyComponent } from './spg/search-company/search-company.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent }, // Default route for the searching page
  { path: '', redirectTo: '/account/auth/landing-page', pathMatch: 'full' }, // Default route redirects to landing page

  { path: 'login', component: LoginComponent },
  { path: 'spg/search-company', component: SearchCompanyComponent },
  { path: 'search', component: SearchingComponent },
  { path: 'bank/:payerID', component: BankComponent },
  { path: 'payment/:payerID', component: PaymentComponent },
  { path: 'payer/:profileID/:searchValue/:searchField', component: PayerComponent },
  { path: 'company/:profileID/:searchValue/:searchField', component: CompanyComponent },
  {
    path: 'account',
    loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
