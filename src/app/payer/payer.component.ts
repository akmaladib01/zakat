import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-payer',
  templateUrl: './payer.component.html',
  styleUrls: ['./payer.component.scss'],
})
export class PayerComponent implements OnInit {
  payerForm: FormGroup;
  isNewRegistration: boolean = false;
  typeID = [
    'KP Baru',
    'KP Lama',
    'Passport',
    'Polis/Tentera'
  ];
  states = [
    'NEGERI SEMBILAN',
    'JOHOR',
    'KEDAH',
    'KELANTAN',
    'MELAKA',
    'NEGERI SEMBILAN',
    'PAHANG',
    'PULAU PINANG',
    'PERAK',
    'PERLIS',
    'SABAH',
    'SARAWAK',
    'SELANGOR',
    'TERENGGANU'
  ];

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private location: Location, private snackBar: MatSnackBar) {
    this.payerForm = this.fb.group({
      payerID: ['',],
      idNumber: ['', Validators.required],
      name: ['', Validators.required],
      identificationID: ['KP Baru', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      postcode: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', Validators.required],
      profileID: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const searchValue = params['searchValue']; // Can be idNumber or name
      const profileID = +params['profileID'];
      const searchField = params['searchField'];
  
      console.log('profileID:', profileID);
      console.log('searchValue:', searchValue);
      console.log('searchField:', searchField);
  
      // Autofill the profileID field
    this.payerForm.patchValue({ profileID });
  
    if (searchField === 'idNumber') {
      // If the search is by idNumber, patch the idNumber field
      this.payerForm.patchValue({ idNumber: searchValue });
    } else if (searchField === 'name') {
      // If the search is by name, patch the name field
      this.payerForm.patchValue({ name: searchValue });
    }
  
      // Fetch payer data from the backend
      if (window['ipcRenderer']) {

        // Check if search is by idNumber or name
        const isSearchByName = searchField === 'name';
        console.log(isSearchByName)
  
        window['ipcRenderer'].send('fetch-payer', { searchValue, profileID, isSearchByName });
  
        window['ipcRenderer'].on('payer-fetched', (_, payerData) => {
          if (payerData) {
            this.isNewRegistration = false; // Existing payer
            this.payerForm.patchValue(payerData);
            const payerID = payerData.payerID;
            console.log('Fetched payerID:', payerID);
          } else {
            this.isNewRegistration = true; // New registration
            console.log('No payer found, form remains empty for new registration.');
          }
        });
  
        window['ipcRenderer'].on('payer-not-found', () => {
          this.isNewRegistration = true; // New registration
          console.log('No payer found, form remains empty for new registration.');
        });
      }
    });
  }

  //function submit into db
  onSubmit(): void {
    // Mark all form controls as touched to trigger validation
    this.markFormAsTouched();
  
    // If the form is invalid, show an error message and prevent submission
    if (this.payerForm.invalid) {
      return;
    }
  
    const formData = this.payerForm.value;
    window['ipcRenderer'].removeAllListeners('update-payer');
    window['ipcRenderer'].removeAllListeners('payer-updated');
  
    if (!formData.profileID) { 
      this.openSnackBar('Profile ID is missing!');
      return;
    }
  
    if (window['ipcRenderer']) {
      if (this.isNewRegistration) {
        // Register new payer
        window['ipcRenderer'].send('register-payer', formData);
  
        window['ipcRenderer'].on('payer-registered', (_, result) => {
          if (result.success) {
            this.openSnackBar('Payer registered successfully.');
            
            // Patch the payerID into the form
            this.payerForm.patchValue({ payerID: result.payerID });
            this.isNewRegistration = false; // Mark as existing payer after registration
          } else {
            this.openSnackBar('Error registering payer: ' + result.error);
          }
        });
      } else {
        // Update existing payer
        window['ipcRenderer'].send('update-payer', formData);
  
        window['ipcRenderer'].on('payer-updated', (_, result) => {
          if (result.success) {
            this.openSnackBar('Payer updated successfully.');
          } else {
            this.openSnackBar('Error updating payer: ' + result.error);
          }
        });
      }
    }
  }
  
  // Manually mark all form controls as touched
  markFormAsTouched(): void {
    Object.keys(this.payerForm.controls).forEach(field => {
      const control = this.payerForm.get(field);
      control?.markAsTouched();
    });
  }

  ngOnDestroy(): void {
    // Reset the form and clear data when the component is destroyed
    this.payerForm.reset();
  }

  goBack(): void {
    this.location.back();
  }

  payment(): void {
  const payerID = this.payerForm.get('payerID')?.value;
  if (!payerID) {
    this.openSnackBar('Payer ID is missing. Please save the form first.');
    return;
  }
  this.router.navigate(['/payment', payerID]);
  }


  openSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      verticalPosition: 'top',
    });
  }
}
