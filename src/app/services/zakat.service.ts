import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ZakatService {
  private zakatList: { jenis: string; amount: number }[] = [];

  getZakatList() {
    return this.zakatList;
  }

  setZakatList(zakatList: { jenis: string; amount: number }[]) {
    this.zakatList = zakatList;
  }
}
