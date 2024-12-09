import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-searching',
  templateUrl: './searching.component.html',
  styleUrls: ['./searching.component.scss']
})
export class SearchingComponent {
  searchOptions = ['No KP Baru', 'No KP Lama', 'No KP Tentera/Polis', 'No Passport', 'No Syarikat', 'Nama Syarikat', 'Nama Individu'];
  selectedOption = this.searchOptions[0];  // Default to the first option (No KP Baru)
  searchData = { search: '' };

  constructor(private router: Router) {}

  selectOption(option: string): void {
    this.selectedOption = option;
  }

  // Search function to handle both ID and name searches
  onSearch(): void {
    const option = this.selectedOption;
    const searchValue = this.searchData.search.trim();

    if (!searchValue) {
      alert('Please enter a value to search.');
      return;
    }

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
        alert('User not found. Redirecting to registration.');
        this.router.navigate([targetPage, profileID, searchValue, searchField]);
      });
    } else {
      console.error('ipcRenderer is not available.');
    }
  }
}
