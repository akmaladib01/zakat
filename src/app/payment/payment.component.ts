import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { ZakatService } from '../services/zakat.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  zakatForm: FormGroup;
  zakatList: { jenis: string; id: number; amount: number }[] = [];
  typeZakat = [
    'Emas Bukan Perhiasan',
    'Emas Perhiasan',
    'Harta',
    'KWSP',
    'Tanaman (Padi)',
    'Pendapatan',
    'Perak',
    'Perniagaan',
    'Qadha',
    'Saham dan Pelaburan',
    'Simpanan',
    'Ternakan',
    'Takaful',
    'Kripto dan Aset Digital',
  ];

    // Mapping of zakat types to their corresponding IDs
    typeZakatMapping: { [key: string]: number } = {
      'Emas Bukan Perhiasan': 46,
      'Emas Perhiasan': 47,
      'Harta': 48,
      'KWSP': 49,
      'Tanaman (Padi)': 50,
      'Pendapatan': 51,
      'Perak': 52,
      'Perniagaan': 53,
      'Qadha': 54,
      'Saham dan Pelaburan': 55,
      'Simpanan': 56,
      'Ternakan': 57,
      'Takaful': 58,
      'Kripto dan Aset Digital': 59,
    };

  payerID: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private zakatService: ZakatService,
    private router: Router,
    private location: Location // Add ChangeDetectorRef
  ) {
    this.zakatForm = this.fb.group({
      jenisZakat: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.payerID = params['payerID'];
    });
    console.log('payerID: ', this.payerID);

    this.zakatList = this.zakatService.getZakatList();
  }

  saveZakat(): void {
    if (this.zakatForm.valid) {
      const { jenisZakat, amount } = this.zakatForm.value;
      const zakatId = this.typeZakatMapping[jenisZakat];
      if (zakatId) {
        this.zakatList = [
          ...this.zakatList,
          { jenis: jenisZakat, amount, id: zakatId },
        ];
        this.zakatForm.reset();
        this.cdr.detectChanges();
      } else {
        alert('Jenis zakat tidak sah.');
      }
    } else {
      alert('Sila lengkapkan semua medan.');
    }
  }

  deleteZakat(index: number): void {
    this.zakatList.splice(index, 1);
    // Update the list with a new reference
    this.zakatList = [...this.zakatList];
    this.cdr.detectChanges(); // Ensure DOM updates
  }

  // TrackBy function for *ngFor optimization
  trackByIndex(index: number, item: any): number {
    return index;
  }

  goBack(): void {
    this.location.back();
  }  

  goToBank(): void {
    // Map zakatList to only include id and amount
    const zakatListForBank = this.zakatList.map(({ jenis, id, amount }) => ({ jenis, id, amount }));
    this.zakatService.setZakatList(zakatListForBank);
    this.router.navigate(['/bank', this.payerID]);
  }
}