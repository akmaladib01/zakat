import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SweetAlertService } from '../services/sweet-alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  userData = { email: '', fullname: '', phone: '' }; // User data for login/registration
  errorMessage = ''; // To display error messages
  isRegistering = false; // Flag to indicate registration mode

  constructor(private router: Router, private alertService: SweetAlertService) {}

  // Handle login or registration
  login(): void {
    const { email, fullname, phone } = this.userData;
  
    window['ipcRenderer'].removeAllListeners('login-response');
    window['ipcRenderer'].removeAllListeners('register-response');
    this.errorMessage = '';
  
    if (!this.isRegistering) {
      // Login process
      if (!email) {
        this.alertService.error('Please enter your email.');
        return;
      }
  
      this.alertService.loading('Checking user...');
      window['ipcRenderer'].send('login', { email });
  
      // Listen for login response
      window['ipcRenderer'].on('login-response', (_, response) => {
        this.alertService.close();
  
        if (response.success) {
          this.alertService.success('Login successful!');
          this.router.navigate(['/dashboard']);
        } else if (response.requiresRegistration) {
          this.isRegistering = true;
          this.alertService.info(response.message);
        } else {
          this.errorMessage = response.message;
        }
      });
    } else {
      // Registration process
      if (!email || !fullname || !phone) {
        this.alertService.error('Please fill in all fields to register.');
        return;
      }
  
      this.alertService.loading('Registering user...');
      window['ipcRenderer'].send('register', { email, fullName: fullname, phoneNumber: phone });
  
      // Listen for registration response
      window['ipcRenderer'].on('register-response', (_, response) => {
        this.alertService.close();
  
        if (response.success) {
          this.alertService.success('Registration successful! Please log in.');
          this.isRegistering = false; // Switch to login mode
          this.userData.fullname = '';
          this.userData.phone = '';
        } else {
          this.errorMessage = response.message;
        }
      });
    }
  }
  
}
