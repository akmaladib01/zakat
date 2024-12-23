import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { IpcRenderer } from "electron"; // Import the Electron IPC renderer

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent {
  userData = { email: "", password: "" };
  errorMessage: string = "";

  constructor( private router: Router) {}

  // Handle the login action
  login(): void {
    const formData = this.userData;
  
    // Clear previous error messages
    this.errorMessage = '';
  
    // Remove any previous listeners for 'login-response'
    window['ipcRenderer'].removeAllListeners('login-response');
  
    // Send login data to the backend
    window['ipcRenderer'].send('login', formData);
  
    // Listen for the login response
    window['ipcRenderer'].on('login-response', (_, response) => {
      if (response.success) {
        // If login is successful, navigate to the kutipan page
        this.router.navigate(['/dashboard']);
      } else {
        // Show error message if login fails
        this.errorMessage = response.message;
      }
    });
  }
  
}
