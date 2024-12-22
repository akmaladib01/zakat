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
  zakatList: { jenis: string; amount: number }[] = [];
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
      this.zakatList = [...this.zakatList, { jenis: jenisZakat, amount }];
      this.zakatForm.reset();
      this.cdr.detectChanges();
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
    this.zakatService.setZakatList(this.zakatList);
    this.router.navigate(['/bank']);
  }  
}