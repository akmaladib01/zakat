import { Component } from '@angular/core';
import { ZakatService } from '../services/zakat.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrl: './bank.component.scss'
})
export class BankComponent {
  zakatList: { jenis: string; amount: number }[] = [];

  constructor(private zakatService: ZakatService, private location: Location) {}

  ngOnInit(): void {
    this.zakatList = this.zakatService.getZakatList();
    console.log(this.zakatList);
  }

  goBack(): void {
    this.location.back();
  } 
}
