import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ZakatService } from '../services/zakat.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss']
})
export class BankComponent implements OnInit {
  payerID: string = '';
  zakatList: { jenis: string; id: number; amount: number }[] = [];
  bankForm: FormGroup;
  bankList = [
    'AFFIN BANK BERHAD',
    'AFFIN ISLAMIC BANK BERHAD',
    'AL RAJHI BANKING & INVESTMENT CORPORATION MALAYSIA BERHAD',
    'ALLIANCE BANK MALAYSIA BERHAD',
    'ALLIANCE ISLAMIC BANK BERHAD',
    'AMBANK (M) BERHAD',
    'AMBANK ISLAMIC BERHAD',
    'BANGKOK BANK BERHAD',
    'BANK ISLAM MALAYSIA BERHAD',
    'BANK KERJASAMA RAKYAT MALAYSIA BERHAD (BANK RAKYAT)',
    'BANK MUAMALAT MALAYSIA BERHAD (BMMB)',
    'BANK NEGARA INDONESIA (BNI)',
    'BANK OF AMERICA MALAYSIA BERHAD',
    'BANK OF CHINA (MALAYSIA) BERHAD',
    'BANK PEMBANGUNAN MALAYSIA BERHAD',
    'BANK SIMPANAN NASIONAL',
    'BNP PARIBAS MALAYSIA BERHAD',
    'CHINA CONSTRUCTION BANK (MALAYSIA) BERHAD',
    'CIMB BANK BERHAD',
    'CIMB ISLAMIC BANK BERHAD',
    'CITIBANK BERHAD',
    'DEUTSCHE BANK (MALAYSIA) BERHAD',
    'HONG LEONG BANK BERHAD',
    'HONG LEONG ISLAMIC BANK BERHAD',
    'HSBC BANK MALAYSIA BERHAD',
    'INDUSTRIAL & COMMERCIAL BANK OF CHINA (MALAYSIA) BERHAD',
    'J.P. MORGAN CHASE BANK BERHAD (JPMO)',
    'KUWAIT FINANCE HOUSE (MALAYSIA) BERHAD',
    'MALAYAN BANKING BERHAD',
    'MAYBANK ISLAMIC BERHAD',
    'MBSB BANK BERHAD',
    'MIZUHO BANK (MALAYSIA) BERHAD',
    'MUFG BANK (MALAYSIA) BERHAD',
    'OCBC AL-AMIN BANK BERHAD',
    'OCBC BANK (MALAYSIA) BERHAD',
    'PUBLIC BANK BERHAD',
    'PUBLIC ISLAMIC BANK BERHAD',
    'RHB BANK BERHAD',
    'RHB ISLAMIC BANK BERHAD',
    'ROYAL BANK OF SCOTLAND',
    'SMALL MEDIUM ENTERPRISE DEVELOPMENT BANK MALAYSIA BERHAD (SME BANK)',
    'STANDARD CHARTERED BANK MALAYSIA BERHAD',
    'STANDARD CHARTERED SAADIQ BERHAD',
    'SUMITOMO MITSUI BANKING CORPORATION MALAYSIA BERHAD',
    'UNITED OVERSEAS BANK (MALAYSIA) BERHAD (UOB)'
  ];

  bankMapping: { [key: string]: number } = {
    'AFFIN BANK BERHAD': 1,
    'AFFIN ISLAMIC BANK BERHAD': 2,
    'AL RAJHI BANKING & INVESTMENT CORPORATION MALAYSIA BERHAD': 3,
    'ALLIANCE BANK MALAYSIA BERHAD': 4,
    'ALLIANCE ISLAMIC BANK BERHAD': 5,
    'AMBANK (M) BERHAD': 6,
    'AMBANK ISLAMIC BERHAD': 7,
    'BANGKOK BANK BERHAD': 8,
    'BANK ISLAM MALAYSIA BERHAD': 9,
    'BANK KERJASAMA RAKYAT MALAYSIA BERHAD (BANK RAKYAT)': 10,
    'BANK MUAMALAT MALAYSIA BERHAD (BMMB)': 11,
    'BANK NEGARA INDONESIA (BNI)': 12,
    'BANK OF AMERICA MALAYSIA BERHAD': 13,
    'BANK OF CHINA (MALAYSIA) BERHAD': 14,
    'BANK PEMBANGUNAN MALAYSIA BERHAD': 15,
    'BANK SIMPANAN NASIONAL': 16,
    'BNP PARIBAS MALAYSIA BERHAD': 17,
    'CHINA CONSTRUCTION BANK (MALAYSIA) BERHAD': 18,
    'CIMB BANK BERHAD': 19,
    'CIMB ISLAMIC BANK BERHAD': 20,
    'CITIBANK BERHAD': 21,
    'DEUTSCHE BANK (MALAYSIA) BERHAD': 22,
    'HONG LEONG BANK BERHAD': 23,
    'HONG LEONG ISLAMIC BANK BERHAD': 24,
    'HSBC BANK MALAYSIA BERHAD': 25,
    'INDUSTRIAL & COMMERCIAL BANK OF CHINA (MALAYSIA) BERHAD': 26,
    'J.P. MORGAN CHASE BANK BERHAD (JPMO)': 27,
    'KUWAIT FINANCE HOUSE (MALAYSIA) BERHAD': 28,
    'MALAYAN BANKING BERHAD': 29,
    'MAYBANK ISLAMIC BERHAD': 30,
    'MBSB BANK BERHAD': 31,
    'MIZUHO BANK (MALAYSIA) BERHAD': 32,
    'MUFG BANK (MALAYSIA) BERHAD': 33,
    'OCBC AL-AMIN BANK BERHAD': 34,
    'OCBC BANK (MALAYSIA) BERHAD': 35,
    'PUBLIC BANK BERHAD': 36,
    'PUBLIC ISLAMIC BANK BERHAD': 37,
    'RHB BANK BERHAD': 38,
    'RHB ISLAMIC BANK BERHAD': 39,
    'ROYAL BANK OF SCOTLAND': 40,
    'SMALL MEDIUM ENTERPRISE DEVELOPMENT BANK MALAYSIA BERHAD (SME BANK)': 41,
    'STANDARD CHARTERED BANK MALAYSIA BERHAD': 42,
    'STANDARD CHARTERED SAADIQ BERHAD': 43,
    'SUMITOMO MITSUI BANKING CORPORATION MALAYSIA BERHAD': 44,
    'UNITED OVERSEAS BANK (MALAYSIA) BERHAD (UOB)': 45
  };

  paymentMethods = ['CASH', 'CHEQUE'];
  isChequeSelected = false;
  submittedPaymentData: any = {};
  totalAmount: number = 0;

  constructor(
    private zakatService: ZakatService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder
  ) {
    this.bankForm = this.fb.group({
      caraPembayaran: ['', Validators.required],
      paymentDate: ['', Validators.required],
      bank: ['', Validators.required],
      noCheque: [''],
      totalAmount: [this.totalAmount, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.payerID = params['payerID'];
      console.log('Received payerID:', this.payerID);
    });
    this.zakatList = this.zakatService.getZakatList();
    console.log(this.zakatList)
    this.calculateTotalAmount();
  }

  onPaymentMethodChange(): void {
    this.isChequeSelected = this.bankForm.get('caraPembayaran')?.value === 'CHEQUE';
    const bankControl = this.bankForm.get('bank');
    const noChequeControl = this.bankForm.get('noCheque');
  
    if (this.isChequeSelected) {
      bankControl?.setValidators([Validators.required]);
      noChequeControl?.setValidators([Validators.required]);
    } else {
      // Clear validators for "CASH"
      bankControl?.clearValidators();
      noChequeControl?.clearValidators();
      bankControl?.setValue(''); // Reset value for cleanliness
      noChequeControl?.setValue('');
    }
  
    bankControl?.updateValueAndValidity();
    noChequeControl?.updateValueAndValidity();
  }
  

  calculateTotalAmount(): void {
    this.totalAmount = this.zakatList.reduce((acc, zakat) => acc + zakat.amount, 0);
    this.bankForm.get('totalAmount')?.setValue(this.totalAmount);
  }

  saveBankPayment(): void {
    if (this.bankForm.valid) {
      const paymentMethod = this.bankForm.get('caraPembayaran')?.value;
  
      if (paymentMethod === 'CHEQUE') {
        const bankName = this.bankForm.get('bank')?.value;
        const bankId = this.bankMapping[bankName];
  
        if (bankId) {
          this.submittedPaymentData = {
            ...this.bankForm.value,
            bankId: bankId
          };
          console.log('Submitted Payment Data:', this.submittedPaymentData);
        } else {
          alert('Bank not found in mapping.');
        }
      } else if (paymentMethod === 'CASH') {
        // For CASH, exclude bank and noCheque
        this.submittedPaymentData = {
          ...this.bankForm.value,
          bank: null, // No bank required
          noCheque: null, // No cheque required
          bankId: null // No bank ID for cash payments
        };
        console.log('Submitted Payment Data:', this.submittedPaymentData);
      }
    } else {
      alert('Please complete all required fields.');
    }
  }
  

  deletePaymentData(): void {
    this.submittedPaymentData = {};
    this.totalAmount = 0;
  }

  goBack(): void {
    this.location.back();
  }

  bayar(): void {
    console.log('Proceeding to payment with data:', this.submittedPaymentData);
  
    if (this.bankForm.valid) {
  
      // Prepare payment data without reference number initially
      const paymentData = {
        date: new Date().toLocaleDateString(),  // Today's date
        time: new Date().toLocaleTimeString(),  // Current time
        totalAmount: this.totalAmount,
        chequeNo: this.bankForm.get('caraPembayaran')?.value === 'CHEQUE' ? this.bankForm.get('noCheque')?.value : null,
        referenceNo: '',  // Placeholder for reference number
        payerID: this.payerID,  // Assuming payerID is already set
        MOP: this.bankForm.get('caraPembayaran')?.value,  // Payment method (CASH or CHEQUE)
        bankID: this.bankMapping[this.bankForm.get('bank')?.value] || null  // Bank ID (null for CASH)
      };
  
      // Remove previous listeners to avoid duplicate events
      window['ipcRenderer'].removeAllListeners('transaction-saved');
      window['ipcRenderer'].removeAllListeners('zakat-details-saved');
      window['ipcRenderer'].removeAllListeners('generated-reference');
  
      if (window['ipcRenderer']) {
        // Request backend to generate the reference number
        window['ipcRenderer'].send('generate-reference', {});
  
        // Listen for the generated reference number
        window['ipcRenderer'].on('generated-reference', (_, generatedReferenceNo) => {
          paymentData.referenceNo = generatedReferenceNo;  // Set the generated reference number
  
          // Send payment data to backend to save transaction
          window['ipcRenderer'].send('save-transaction', paymentData);
  
          // Listen for the response when the transaction is saved
          window['ipcRenderer'].on('transaction-saved', (_, result) => {
            if (result.success) {
              const transactionID = result.transactionID;
  
              // Prepare zakat details
              const zakatDetails = this.zakatList.map(zakat => ({
                zakatID: zakat.id,
                amount: zakat.amount
              }));
  
              // Send zakat details to backend
              window['ipcRenderer'].send('save-transaction-zakat', {
                transactionID: transactionID,
                zakatDetails: zakatDetails
              });
  
              // Listen for the response when zakat details are saved
              window['ipcRenderer'].on('zakat-details-saved', (_, result) => {
                if (result.success) {
                  alert('Payment and zakat details saved successfully!');
                } else {
                  alert('Error saving zakat details: ' + result.error);
                }
              });
            } else {
              alert('Error saving transaction: ' + result.error);
            }
          });
        });
      }
    } else {
      alert('Please complete all required fields.');
      console.log(this.bankForm.value);
    }
  }
  
  
}
