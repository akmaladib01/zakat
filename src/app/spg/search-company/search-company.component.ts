import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-search-company',
  templateUrl: './search-company.component.html',
  styleUrls: ['./search-company.component.scss']
})
export class SearchCompanyComponent {
  companyName: string = '';
  registrationNumber: string = '';
  address: string = '';
  companies: any[] = [];
  searchCriteria: string = 'name';
  searchPerformed: boolean = false;
  isSearching: boolean = false;

  constructor(
    private dbService: DatabaseService,
    private router: Router
  ) {}

  setSearchCriteria(criteria: string): void {
    this.searchCriteria = criteria;

    if (criteria === 'name') {
      this.registrationNumber = '';
    } else if (criteria === 'registrationNumber') {
      this.companyName = '';
    }
  }

  async searchCompany() {
    this.searchPerformed = true;

    const searchValue =
      this.searchCriteria === 'name'
        ? this.companyName
        : this.registrationNumber;

    if (!searchValue) {
      Swal.fire({
        title: 'Input Missing',
        text: `Please enter a ${
          this.searchCriteria === 'name'
            ? 'Company Name'
            : 'Company Registration Number'
        }.`,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    this.companies = await this.dbService.searchCompany(
      this.companyName ?? '',
      this.registrationNumber ?? ''
    );

    if (this.companies.length === 0) {
      Swal.fire({
        title: 'No Results Found',
        text: 'No companies found. Please try a different search.',
        icon: 'info',
        confirmButtonText: 'OK',
      });
    }
  }

  viewCompanyDetails(company: any) {
    this.router.navigate(['/register-company'], {
      queryParams: {
        payerID: company.payerID,
        idNumber: company.idNumber,
        name: company.name,
        address1: company.address1,
        address2: company.address2,
        postcode: company.postcode,
        city: company.city,
        state: company.state,
        phoneNumber: company.phoneNumber,
        email: company.email,
        sector: company.sector,
        faxnumber: company.faxnumber,
        website: company.website,
        muslimStaff: company.muslimStaff,
        ownershipPercentage: company.ownershipPercentage,
        PICName: company.PICName,
        PICEmail: company.PICEmail,
        PICPhoneNumber: company.PICPhoneNumber,
      },
    });
  }

  navigateToRegisterCompany(company: any) {
    if (company) {
      this.router.navigate(['/register-company'], {
        queryParams: {
          payerID: company.payerID,
          idNumber: company.idNumber,
          name: company.name,
          address1: company.address1,
          address2: company.address2,
          postcode: company.postcode,
          city: company.city,
          state: company.state,
          phoneNumber: company.phoneNumber,
          email: company.email,
          sector: company.sector,
          faxnumber: company.faxnumber,
          website: company.website,
          muslimStaff: company.muslimStaff,
          ownershipPercentage: company.ownershipPercentage,
          PICName: company.PICName,
          PICEmail: company.PICEmail,
          PICPhoneNumber: company.PICPhoneNumber,
          profileID: '2',
          syncStat: '0',
        },
      });
    } else {
      this.router.navigate(['/register-company']);
    }
  }

  proceedToPayment() {
    if (this.companies.length > 0) {
      this.router.navigate(['/payment'], {
        state: { company: this.companies[0] },
      });
    } else {
      Swal.fire({
        title: 'No Company Selected',
        text: 'Please select or register a company first.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    }
  }

  getFormattedAddress(company: any): string {
    const { address1, address2, postcode, city, state } = company || {};
    return [address1, address2, postcode, city, state]
      .filter(Boolean)
      .join(', ');
  }

  RegisterCompany(): void {
    this.router.navigate(['/register-company'], { state: { isRegistering: true } });
  }

  clearResults() {
    this.companies = [];
    this.searchPerformed = false;
    this.companyName = '';
    this.registrationNumber = '';
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
