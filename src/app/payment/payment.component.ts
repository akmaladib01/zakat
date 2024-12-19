import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent {
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

  constructor(private fb: FormBuilder) {
    this.zakatForm = this.fb.group({
      jenisZakat: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
    });
  }

  saveZakat(): void {
    if (this.zakatForm.valid) {
      const { jenisZakat, amount } = this.zakatForm.value;
      this.zakatList.push({ jenis: jenisZakat, amount });
      this.zakatForm.reset();
    } else {
      alert('Sila lengkapkan semua medan.');
    }
  }

  deleteZakat(index: number): void {
    this.zakatList.splice(index, 1);
  }
}
