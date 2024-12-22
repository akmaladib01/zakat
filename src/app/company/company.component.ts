import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss'
})
export class CompanyComponent {
  payerForm: FormGroup;
  isNewRegistration: boolean = false;
  sektor = [
    'Kerajaan',
    'Berkanun',
    'Swasta'
  ];
  typeID = [
    'SSM Lama',
    'SSM Baru',
    'Lain-lain'
  ];
  states = [
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

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {
    this.payerForm = this.fb.group({
      payerID: [''],
      idNumber: [''],
      name: [''],
      sector: [''],
      identificationID: [''], // Ensure default value matches options, e.g., 'SSM Baru'
      address1: [''],
      address2: [''],
      postcode: [''],
      city: [''],
      state: [''],
      phoneNumber: [''],
      faxNumber: [''],
      website: [''],
      muslimStaff: [''],
      ownershipPercentage: [''],
      PICName: [''],
      PICEmail: [''],
      PICPhoneNumber: [''],
      profileID: [''],
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
        this.payerForm.patchValue({ idNumber: searchValue });
      }
  
      // Fetch payer data from the backend
      if (window['ipcRenderer']) {

        // Check if search is by idNumber or name
        const isSearchByName = searchField === 'name';
        console.log(isSearchByName)
  
        window['ipcRenderer'].send('fetch-company', { searchValue, profileID, isSearchByName });
  
        window['ipcRenderer'].on('company-fetched', (_, payerData) => {
          if (payerData) {
            this.isNewRegistration = false; // Existing payer
            this.payerForm.patchValue(payerData);
            const payerID = payerData.payerID;
            console.log('Fetched payerID:', payerID);
          } else {
            this.isNewRegistration = true; // New registration
            console.log('No company found, form remains empty for new registration.');
          }
        });
  
        window['ipcRenderer'].on('company-not-found', () => {
          this.isNewRegistration = true; // New registration
          console.log('No company found, form remains empty for new registration.');
        });
      }
    });
  }

  //function submit data to db
  onSubmit(): void {
    const formData = this.payerForm.value;
    window['ipcRenderer'].removeAllListeners('update-company');
    window['ipcRenderer'].removeAllListeners('company-updated');
    window['ipcRenderer'].removeAllListeners('company-registered');

    if (!formData.profileID) { 
      this.openSnackBar('Profile ID is missing!');
      return;
    }

    if (window['ipcRenderer']) {
      if (this.isNewRegistration) {
        // Register new payer
        window['ipcRenderer'].send('register-company', formData);

        window['ipcRenderer'].on('company-registered', (_, result) => {
          if (result.success) {
            this.openSnackBar('Company registered successfully.');
          } else {
            this.openSnackBar('Error registering payer: ' + result.error);
          }
        });
      } else {
        // Update existing payer
        window['ipcRenderer'].send('update-company', formData);

        window['ipcRenderer'].on('company-updated', (_, result) => {
          if (result.success) {
            this.openSnackBar('Company updated successfully.');
          } else {
            this.openSnackBar('Error updating company: ' + result.error);
          }
        });
      }
    }
  } 

  ngOnDestroy(): void {
    // Reset the form and clear data when the component is destroyed
    this.payerForm.reset();
  }

  goBack(): void {
    this.router.navigate(['']); // Replace with the actual path for the search page
  }

  payment(): void {
    const payerID = this.payerForm.get('payerID')?.value
    this.router.navigate(['/payment', payerID])
  }

  openSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
