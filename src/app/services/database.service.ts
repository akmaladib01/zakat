import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor() {}

  // 1. Register Company
  async registerCompany(company: any): Promise<any> {
    if ((window as any).electronAPI) {
      return (window as any).electronAPI.registerCompany(company);
    } else {
      console.error('Electron API is not available.');
      return null;
    }
  }

  // 2. Search Company
  async searchCompany(name: string, regNumber: string): Promise<any> {
    if ((window as any).electronAPI) {
      return (window as any).electronAPI.searchCompany(name, regNumber);
    } else {
      console.log("Is Electron API available:", window.electronAPI ? "Yes" : "No");
      return null;
    }
  }

  // 3. Submit SPG Payment
  async submitPayment(payment: any): Promise<any> {
    if ((window as any).electronAPI) {
      return (window as any).electronAPI.submitPayment(payment);
    } else {
      console.error('Electron API is not available.');
      return null;
    }
  }

  // 4. Generate Receipt
  async generateReceipt(spgID: number): Promise<any> {
    if ((window as any).electronAPI) {
      return (window as any).electronAPI.generateReceipt(spgID);
    } else {
      console.error('Electron API is not available.');
      return null;
    }
  }

  async getCompanyByPayerID(payerID: string): Promise<any> {
    if ((window as any).electronAPI) {
      try {
        const companyDetails = await (window as any).electronAPI.getCompanyByPayerID(payerID);
        if (companyDetails) {
          console.log('Company Details:', companyDetails);
        } else {
          console.error('No company found for payerID:', payerID);
        }
        return companyDetails;
      } catch (error) {
        console.error('Error fetching company by payerID:', error);
        return null;
      }
    } else {
      console.error('Electron API is not available.');
      return null;
    }
  }

  async getCompanyByIdNumber(idNumber: string): Promise<any> {
    if ((window as any).electronAPI) {
      try {
        // Use Electron's API to retrieve company by idNumber
        const companyDetails = await (window as any).electronAPI.getCompanyByIdNumber(idNumber);
        if (companyDetails) {
          console.log('Company Details:', companyDetails);
        } else {
          console.error('No company found for idNumber:', idNumber);
        }
        return companyDetails;
      } catch (error) {
        console.error('Error fetching company by idNumber:', error);
        return null;
      }
    } else {
      console.error('Electron API is not available.');
      return null;
    }
  }
  
 
} 
