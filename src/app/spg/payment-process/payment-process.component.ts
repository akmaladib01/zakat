import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { DatePipe } from '@angular/common';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-payment',
  templateUrl: './payment-process.component.html',
  styleUrls: ['./payment-process.component.scss'],
  providers: [DatePipe]
})
export class PaymentComponent implements OnInit {
  @ViewChild('picker') datePickerElement!: MatDatepicker<any>;

  payment = {
    HeaderID: '',
    noCheque: '',
    bulanTahun: '', // Month/Year input
    Amaun: '',
    bankID: '',
    MOPID: 1,
    payerID: 0,
  };

  bankList = [
    { value: 1, viewValue: 'Maybank' },
    { value: 2, viewValue: 'CIMB Bank' },
    { value: 3, viewValue: 'Public Bank' },
    { value: 4, viewValue: 'RHB Bank' },
    { value: 5, viewValue: 'Hong Leong Bank' },
  ];

  mopList = [
    { id: 1, viewValue: 'Cheque' },
    { id: 2, viewValue: 'Cash' },
  ];

  isProcessing = false;
  isUpdateMode = false;

  constructor(
    private dbService: DatabaseService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      console.log('Query Params:', params);  // Debugging step
      if (params['payerID']) {
        this.payment.payerID = +params['payerID'];
        console.log('Payer ID:', this.payment.payerID);
      } else {
        console.error('No payerID found in query parameters.');
      }
    });
  }

  // Handle Month/Year Selection
  chooseMonthAndYear(normalizedMonth: Date, datepicker: MatDatepicker<any>): void {
    const formattedDate = this.datePipe.transform(normalizedMonth, 'MM/yyyy');
    if (formattedDate) {
      this.payment.bulanTahun = formattedDate;
    }
    datepicker.close();
  }

  async registerOrUpdatePayment() {
    if (this.isProcessing) return;

    this.isProcessing = true;

    try {
      if (this.isUpdateMode) {
        const result = await window.electronAPI.updatePayment(this.payment);
        alert(result ? 'Payment updated successfully.' : 'Failed to update payment.');
      } else {
        await this.registerPayment();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during payment processing.');
    } finally {
      this.isProcessing = false;
    }
  }

  async registerPayment() {
    try {
      this.payment.HeaderID = this.generateHeaderID();

      if (!this.payment.bulanTahun) {
        throw new Error('Please select a valid month and year.');
      }

      const result = await window.electronAPI.registerPayment(this.payment);
      if (result) {
        alert('Payment registered successfully.');

        // Pass paymentData and payerID to the receipt component
        this.router.navigate(['/receipt'], {
          queryParams: {
            paymentData: JSON.stringify(this.payment),
            payerID: this.payment.payerID
          }
        });
      } else {
        alert('Failed to register payment.');
      }
    } catch (error) {
      console.error('Error registering payment:', error);
      alert('An error occurred while registering the payment.');
    }
  }

  generateHeaderID(): string {
    const randomNumbers = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit random number
    return `${randomNumbers}`;
  }

  cancel() {
    const payerID = this.payment.payerID;

    this.router.navigate(['/register-company'], {
      queryParams: { payerID: payerID }
    });
  }
}
