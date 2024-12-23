import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-register-company',
  templateUrl: './register-company.component.html',
  styleUrls: ['./register-company.component.scss']
})
export class RegisterCompanyComponent implements OnInit {
  isUpdateMode: boolean = false;
  isProcessing = false;
  isRegistering: boolean = false;
  isEditMode: boolean = false;

  company: any = {
    payerID: '',
    idNumber: '',
    name: '',
    address1: '',
    address2: '',
    postcode: '',
    city: '',
    state: '',
    phoneNumber: '',
    email: '',
    sector: '',
    faxnumber: '',
    website: '',
    muslimStaff: '',
    ownershipPercentage: '',
    PICName: '',
    PICEmail: '',
    PICPhoneNumber: '',
    profileID: '2',
    //syncStat: '0',
  };

  constructor(private dbService: DatabaseService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      console.log('Query Params:', params);
      if (params['payerID']) {
        const payerID = params['payerID'];
        this.loadCompanyDetailsByPayerID(payerID);
        this.isUpdateMode = true;
      } else {
        this.isUpdateMode = false;
        const navigationState = history.state;
        this.isRegistering = navigationState.isRegistering ?? false;
      }
    });
  }

  async loadCompanyDetailsByPayerID(payerID: string) {
    try {
      const companyDetails = await window.electronAPI.getCompanyByPayerID(payerID);
      console.log('Fetched Company Details:', companyDetails);
      console.log('Payer ID sent to register-company:', this.route.snapshot.queryParams['payerID']);
      if (companyDetails) {
        this.company = { ...companyDetails };
      } else {
        alert('No company details found for the provided Payer ID.');
      }
    } catch (error) {
      console.error('Error loading company details:', error);
      alert('Failed to fetch company details.');
    }
  }

  async updatePayer() {
    if (this.isProcessing) {
      return;
    }
    this.isProcessing = true;
  
    try {
      if (!this.company.payerID) {
        alert('Payer ID is missing. Cannot update the record.');
        return;
      }
  
      console.log('Updating payer with ID:', this.company.payerID);
      const result = await window.electronAPI.updatePayer(this.company);
  
      if (result) {
        alert('Payer data updated successfully.');
      } else {
        alert('No changes were made. Verify Payer ID or data.');
      }
    } catch (error) {
      console.error('Error updating payer data:', error);
      alert('An error occurred while updating the payer details.');
    }
  
    this.isProcessing = false;
  }

  onBackButtonClick() {
    this.router.navigate(['/search-company']);
  }

  async registerCompany() {
    if (this.isProcessing) return;
  
    this.isProcessing = true;
  
    if (this.validateForm()) {
      try {
        await this.dbService.registerCompany(this.company);
        alert('Company registered successfully!');
      } catch (error) {
        console.error('Error registering company:', error);
        alert('Failed to register the company.');
      }
    } else {
      alert('Please fill in all required fields.');
    }
  
    this.isProcessing = false;
  }

  validateForm(): boolean {
    return (
      this.company.idNumber &&
      this.company.name &&
      this.company.address1 &&
      this.company.postcode &&
      this.company.city &&
      this.company.state &&
      this.company.phoneNumber &&
      this.company.email &&
      this.company.sector &&
      this.company.PICName &&
      this.company.PICEmail &&
      this.company.PICPhoneNumber
    );
  }
}
