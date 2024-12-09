import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {
    this.payerForm = this.fb.group({
      idNumber: [''],
      name: [''],
      identificationID: ['KP Baru'],
      address1: [''],
      address2: [''],
      postcode: [''],
      city: [''],
      state: [''],
      phoneNumber: [''],
      email: [''],
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
  
        window['ipcRenderer'].send('fetch-payer', { searchValue, profileID, isSearchByName });
  
        window['ipcRenderer'].on('payer-fetched', (_, payerData) => {
          if (payerData) {
            this.isNewRegistration = false; // Existing payer
            this.payerForm.patchValue(payerData);
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

  //function submit data to db
  onSubmit(): void {
    const formData = this.payerForm.value;
    window['ipcRenderer'].removeAllListeners('update-payer');
    window['ipcRenderer'].removeAllListeners('payer-updated');

    if (!formData.profileID) { 
      alert('Profile ID is missing!');
      return;
    }

    if (window['ipcRenderer']) {
      if (this.isNewRegistration) {
        // Register new payer
        window['ipcRenderer'].send('register-payer', formData);

        window['ipcRenderer'].on('payer-registered', (_, result) => {
          if (result.success) {
            alert('Payer registered successfully.');
          } else {
            alert('Error registering payer: ' + result.error);
          }
        });
      } else {
        // Update existing payer
        window['ipcRenderer'].send('update-payer', formData);

        window['ipcRenderer'].on('payer-updated', (_, result) => {
          if (result.success) {
            alert('Payer updated successfully.');
          } else {
            alert('Error updating payer: ' + result.error);
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
}
