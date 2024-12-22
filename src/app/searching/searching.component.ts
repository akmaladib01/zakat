import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar

@Component({
  selector: 'app-searching',
  templateUrl: './searching.component.html',
  styleUrls: ['./searching.component.scss']
})
export class SearchingComponent {
  searchOptions = ['No KP Baru', 'No KP Lama', 'No KP Tentera/Polis', 'No Passport', 'No Syarikat', 'Nama Syarikat', 'Nama Individu'];
  selectedOption = this.searchOptions[0]; 
  searchData = { search: '' };
  isUserNotFound = false;

  constructor(private router: Router, private snackBar: MatSnackBar) {}

  selectOption(option: string): void {
    this.selectedOption = option;
    this.isUserNotFound = false;
  }

  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    if (this.selectedOption === 'No KP Baru') {
      // Allow only numbers for "No KP Baru"
      inputElement.value = inputElement.value.replace(/[^0-9]/g, '');
    }
    // If the selected option is not "No KP Baru", allow both numbers and letters
  }

  // Function to validate No KP Baru
  validateNoKP(noKP: string): boolean {
    const validRegions = {
      "Johor": ["01", "21", "22", "23", "24"],
      "Kedah": ["02", "25", "26", "27"],
      "Kelantan": ["03", "28", "29"],
      "Melaka": ["04", "30"],
      "Negeri Sembilan": ["05", "31", "59"],
      "Pahang": ["06", "32", "33"],
      "Pulau Pinang": ["07", "34", "35"],
      "Perak": ["08", "36", "37", "38", "39"],
      "Perlis": ["09", "40"],
      "Selangor": ["10", "41", "42", "43", "44"],
      "Terengganu": ["11", "45", "46"],
      "Sabah": ["12", "47", "48", "49"],
      "Sarawak": ["13", "50", "51", "52", "53"],
      "Wilayah Persekutuan (Kuala Lumpur)": ["14", "54", "55", "56", "57"],
      "Wilayah Persekutuan (Labuan)": ["15", "58"],
      "Wilayah Persekutuan (Putrajaya)": ["16"],
      "Negeri Tidak Diketahui": ["82"]
    };

    // Check if the input has 12 digits
    if (noKP.length !== 12) {
      this.openSnackBar('Sila guna format No KP yang betul (12 digit).');
      return false;
    }

    // Check if the first 2 digits are valid (can be anything)
    const month = noKP.substring(2, 4); // Extract month (3rd and 4th digits)
    if (parseInt(month) < 1 || parseInt(month) > 12) {
      this.openSnackBar('Sila guna format No KP yang betul.');
      return false;
    }

    // Check if the 5th and 6th digits are a valid day for the month
    const day = noKP.substring(4, 6); // Extract day (5th and 6th digits)
    const validDays = this.getValidDaysForMonth(parseInt(month));
    if (!validDays.includes(parseInt(day))) {
      this.openSnackBar('Sila guna format No KP yang betul.');
      return false;
    }

    // Check if the 7th and 8th digits are a valid region code
    const regionCode = noKP.substring(6, 8); // Extract region code (7th and 8th digits)
    const validRegionCodes = Object.values(validRegions).flat();
    if (!validRegionCodes.includes(regionCode)) {
      this.openSnackBar('Sila guna format No KP yang betul.');
      return false;
    }

    // Check if the last 4 digits are valid (0000-9999)
    const lastFour = noKP.substring(8, 12); // Extract the last 4 digits
    if (isNaN(Number(lastFour)) || Number(lastFour) < 0 || Number(lastFour) > 9999) {
      this.openSnackBar('Sila guna format No KP yang betul.');
      return false;
    }

    return true;
  }

  // Function to get valid days for the selected month
  getValidDaysForMonth(month: number): number[] {
    const daysInMonth: { [key: number]: number[] } = {
      1: Array.from({ length: 31 }, (_, i) => i + 1),
      2: Array.from({ length: 28 }, (_, i) => i + 1),
      3: Array.from({ length: 31 }, (_, i) => i + 1),
      4: Array.from({ length: 30 }, (_, i) => i + 1),
      5: Array.from({ length: 31 }, (_, i) => i + 1),
      6: Array.from({ length: 30 }, (_, i) => i + 1),
      7: Array.from({ length: 31 }, (_, i) => i + 1),
      8: Array.from({ length: 31 }, (_, i) => i + 1),
      9: Array.from({ length: 30 }, (_, i) => i + 1),
      10: Array.from({ length: 31 }, (_, i) => i + 1),
      11: Array.from({ length: 30 }, (_, i) => i + 1),
      12: Array.from({ length: 31 }, (_, i) => i + 1),
    };

    return daysInMonth[month] || [];
  }

  onSearch(): void {
    const option = this.selectedOption;
    const searchValue = this.searchData.search.trim();

    if (!searchValue) {
      this.openSnackBar('Please enter a value to search.');
      return;
    }

    if (this.selectedOption === 'No KP Baru' && !this.validateNoKP(searchValue)) {
      return;
    }

    this.isUserNotFound = false;

    // Reset the not found status
    this.isUserNotFound = false;

    // Assign profile based on the search option
    let profileID: number;
    let searchField: string;
    let targetPage: string;

    // Determine profileID and searchField based on the selected option
    if (option === 'No Syarikat' || option === 'Nama Syarikat') {
      profileID = 2; // Company profile
      targetPage = '/company'; // Navigate to the company page
      searchField = option === 'Nama Syarikat' ? 'name' : 'idNumber';
    } else {
      profileID = 1; // Individual profile
      targetPage = '/payer'; // Navigate to the payer page
      searchField = option === 'Nama Individu' ? 'name' : 'idNumber';
    }

    if (window['ipcRenderer']) {
      window['ipcRenderer'].removeAllListeners('user-found');
      window['ipcRenderer'].removeAllListeners('user-not-found');

      // Send the search data to the backend with profileID and searchField
      window['ipcRenderer'].send('search-user', { profileID, searchValue, searchField });

      // Listen for the result from the backend
      window['ipcRenderer'].once('user-found', (_, userData) => {
        console.log('User found:', userData);
        this.router.navigate([targetPage, profileID, searchValue, searchField]);
      });

      window['ipcRenderer'].once('user-not-found', () => {
        this.isUserNotFound = true;
        alert('User not found. Please search again or click "Daftar" to register.');
      });
    } else {
      console.error('ipcRenderer is not available.');
    }
  }

  onRegister(): void {
    if (!this.isUserNotFound) {
      this.openSnackBar('Please search for a user first.');
      return;
    }

    const profileID = this.selectedOption.includes('Syarikat') ? 2 : 1;
    const searchValue = this.searchData.search.trim();
    const targetPage = profileID === 2 ? '/register-company' : '/register-individual';

    if (this.isUserNotFound) {
      const targetRoute = profileID === 2 ? '/company' : '/payer';
      this.router.navigate([targetRoute, profileID, searchValue, 'idNumber']);
    } else {
      this.router.navigate([targetPage]);
    }
  }

  openSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
