// import { Injectable } from '@angular/core';
// import { ipcRenderer } from 'electron'; // For communication with Electron backend
// import { Router } from '@angular/router';

// @Injectable({
//   providedIn: 'root',
// })
// export class LoginService {
//   constructor(private router: Router) {}

//   // Handle user login
//   login(email: string, password: string): Promise<any> {
//     return new Promise((resolve, reject) => {
//       // Validate email domain
//       if (!email.endsWith('@zakat.com')) {
//         reject('Invalid email domain. Please use a @zakat.com email.');
//         return;
//       }

//       // Send login request to backend (Electron)
//       ipcRenderer.send('login-user', { email, password });

//       // Listen for login success or failure
//       ipcRenderer.once('login-success', (event, data) => {
//         if (data.sessionID) {
//           // Store session data
//           localStorage.setItem('sessionID', data.sessionID.toString());
//           localStorage.setItem('user', JSON.stringify(data.user));

//           // Resolve promise with success
//           resolve(data);
//         }
//       });

//       ipcRenderer.once('login-failed', (event, data) => {
//         reject(data.message);
//       });
//     });
//   }

//   // Validate session on page load
//   validateSession(): boolean {
//     const sessionID = localStorage.getItem('sessionID');
//     return !!sessionID;
//   }

//   // Logout user
//   logout(): void {
//     localStorage.removeItem('sessionID');
//     localStorage.removeItem('user');
//     this.router.navigate(['/login']);
//   }
// }
