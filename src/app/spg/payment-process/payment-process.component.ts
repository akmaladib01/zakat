import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { DatePipe } from '@angular/common';
import { MatDatepicker } from '@angular/material/datepicker';

import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import moment from 'moment';

@Component({
  selector: 'app-payment',
  templateUrl: './payment-process.component.html',
  styleUrls: ['./payment-process.component.scss'],
  providers: [DatePipe],
})
export class PaymentComponent implements OnInit {
  @ViewChild('picker') datePickerElement!: MatDatepicker<any>;

  moment = moment;

  payment = {
    HeaderID: '',
    noCheque: '',
    bulanTahun: '', // Month/Year input
    Amaun: '',
    bankID: '',
    MOPID: 1,
    payerID: 0,
  };

  dateControl = new FormControl(moment());

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
      if (params['payerID']) {
        this.payment.payerID = +params['payerID'];
      }
    });
  }
  chooseMonthAndYear(normalizedMonth: Date, datepicker: MatDatepicker<any>): void {
    const monthYear = new Date(
      normalizedMonth.getFullYear(),
      normalizedMonth.getMonth(),
      1
    );
  
    // Format to MM/YYYY
    this.payment.bulanTahun = moment(monthYear).format('MM/YYYY');
    console.log('Selected Month/Year:', this.payment.bulanTahun);
  
    // Close the datepicker
    datepicker.close();
  }

  async registerPayment() {
    try {
      this.payment.HeaderID = this.generateHeaderID();

      if (!this.payment.bulanTahun) {
        throw new Error('Please select a valid month and year.');
      }

      const result = await window.electronAPI.registerPayment(this.payment);
      if (result) {
        Swal.fire({
          icon: 'success',
          title: 'Payment registered successfully.',
        });

        this.router.navigate(['/receipt'], {
          queryParams: {
            paymentData: JSON.stringify(this.payment),
            payerID: this.payment.payerID,
          },
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to register payment.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'An error occurred while registering the payment.',
      });
    }
  }

  generateHeaderID(): string {
    const randomNumbers = Math.floor(1000 + Math.random() * 9000);
    return `${randomNumbers}`;
  }

  cancel() {
    const payerID = this.payment.payerID;
    this.router.navigate(['/register-company'], {
      queryParams: { payerID: payerID },
    });
  }
}
