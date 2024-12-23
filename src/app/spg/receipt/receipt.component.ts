import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss'],
})
export class ReceiptComponent implements OnInit {
  paymentData: any;  
  companyDetails: any; 
  payerID!: number;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['paymentData']) {
        this.paymentData = JSON.parse(params['paymentData']); // Parse the payment data string
        console.log('Payment Data:', this.paymentData);
      } else {
        console.error('No payment data found.');
      }

      if (params['payerID']) {
        const payerID = +params['payerID'];
        console.log('Payer ID:', payerID);

        // Fetch company details based on payerID
        this.fetchCompanyDetails(payerID);
      } else {
        console.error('No payerID found.');
      }
    });
  }

  async fetchCompanyDetails(payerID: number) {
    try {
      this.companyDetails = await window.electronAPI.getCompanyByPayerID(payerID.toString());
      console.log('Company Details:', this.companyDetails); 
    } catch (error) {
      console.error('Error fetching company details:', error);
    }
  }

  printReceipt(): void {
    window.print(); // Simple browser print functionality
  }

  goBack(): void {
    const payerID = this.payerID;
    console.log('Navigating back with payerID:', payerID); // Debugging step
    console.log('Company Details:', this.companyDetails);  // Debugging step
  
    if (this.companyDetails && this.companyDetails.payerID) {
      this.router.navigate(['/payment-process'], {
        queryParams: { payerID: this.companyDetails.payerID },
      });
    } else {
      console.error('No payerID to navigate with!');
    }
  }
}
