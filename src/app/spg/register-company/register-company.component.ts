import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

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
  };

  formErrors = {
    idNumber: false,
    name: false,
    sector: false,
    address1: false,
    postcode: false,
    city: false,
    state: false,
    phoneNumber: false,
    email: false,
    PICName: false,
    PICEmail: false,
    PICPhoneNumber: false
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
      if (companyDetails) {
        this.company = { ...companyDetails };
      } else {
        this.showAlert('No company details found for the provided Payer ID.', 'error');
      }
    } catch (error) {
      console.error('Error loading company details:', error);
      this.showAlert('Failed to fetch company details.', 'error');
    }
  }

  async updatePayer() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    if (!this.company.payerID) {
      this.showAlert('Payer ID is missing. Cannot update the record.', 'error');
      this.isProcessing = false;
      return;
    }

    try {
      const result = await window.electronAPI.updatePayer(this.company);

      if (result) {
        this.showAlert('Payer data updated successfully!', 'success');
      } else {
        this.showAlert('No changes were made. Verify Payer ID or data.', 'error');
      }
    } catch (error) {
      console.error('Error updating payer data:', error);
      this.showAlert('An error occurred while updating the payer details.', 'error');
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
        // Register the company and capture the returned company object (including payerID)
        const registeredCompany = await this.dbService.registerCompany(this.company);
  
        if (registeredCompany.success) {
          // Company registered successfully
          this.company.payerID = registeredCompany.payerID; // Set payerID
  
          // Show success message using SweetAlert2
          Swal.fire({
            title: 'Success!',
            text: 'Company registered successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
  
          // Ensure payerID is available and pass it to the /payment-process route
          if (this.company.payerID) {
            // Redirect to the /payment-process page with payerID as a query parameter
            this.router.navigate(['/payment-process'], { queryParams: { payerID: this.company.payerID } });
          } else {
            // Handle the case where payerID is not available
            Swal.fire({
              title: 'Error!',
              text: 'Payer ID could not be retrieved. Please try again.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        } else {
          // Show error message using SweetAlert2 if company already exists
          Swal.fire({
            title: 'Error!',
            text: registeredCompany.error,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      } catch (error) {
        console.error('Error registering company:', error);
        // Show error message using SweetAlert2 for general errors
        Swal.fire({
          title: 'Error!',
          text: 'Failed to register the company.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } else {
      // Show error message using SweetAlert2 if validation fails
      Swal.fire({
        title: 'Error!',
        text: 'Please fill in all required fields correctly.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  
    this.isProcessing = false;
  }

  validateForm(): boolean {
    let isValid = true;
    this.formErrors = {
      idNumber: !this.company.idNumber,
      name: !this.company.name,
      sector: !this.company.sector,
      address1: !this.company.address1,
      postcode: !this.company.postcode || this.company.postcode.length !== 5,
      city: !this.company.city,
      state: !this.company.state,
      phoneNumber: !this.company.phoneNumber || !this.isValidPhoneNumber(this.company.phoneNumber),
      email: !this.company.email || !this.isValidEmail(this.company.email),
      PICName: !this.company.PICName,
      PICEmail: !this.company.PICEmail || !this.isValidEmail(this.company.PICEmail),
      PICPhoneNumber: !this.company.PICPhoneNumber || !this.isValidPhoneNumber(this.company.PICPhoneNumber),
    };
  
    // Show specific validation error messages
    if (this.formErrors.postcode) {
      this.showAlert('Postcode must be exactly 5 digits.', 'error');
    }
    if (this.formErrors.phoneNumber) {
      this.showAlert('Phone number must be a valid format.', 'error');
    }
    if (this.formErrors.email) {
      this.showAlert('Email must be a valid email address.', 'error');
    }
  
    return Object.values(this.formErrors).every(error => !error);
  }
  
  // Email validation
  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }
  
  // Phone number validation (basic example, customize as needed)
  isValidPhoneNumber(phone: string): boolean {
    const phonePattern = /^[0-9]{10,}$/; // Matches a phone number with 10 or more digits
    return phonePattern.test(phone);
  }

  showAlert(message: string, type: 'success' | 'error') {
    Swal.fire({
      icon: type,
      title: type === 'success' ? 'Success' : 'Error',
      text: message,
    });
  }
}
