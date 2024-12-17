import { Component, NgZone, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  status: string = 'Checking...';
  isOnline: boolean = false;

  constructor(private ngZone: NgZone, private snackBar: MatSnackBar) {}

  ngOnInit() {
    // Initialize the status
    this.updateStatus(navigator.onLine);

    // Listen for online/offline events
    window.addEventListener('online', () => this.ngZone.run(() => this.handleConnectionChange(true)));
    window.addEventListener('offline', () => this.ngZone.run(() => this.handleConnectionChange(false)));

    // Periodic status check
    setInterval(() => {
      fetch('https://www.google.com', { method: 'HEAD' })
        .then(() => this.ngZone.run(() => this.handleConnectionChange(true)))
        .catch(() => this.ngZone.run(() => this.handleConnectionChange(false)));
    }, 30000);
  }

  handleConnectionChange(isOnline: boolean) {
    if (this.isOnline !== isOnline) {
      this.isOnline = isOnline;
      this.status = isOnline ? 'Online' : 'Offline';
      this.showNotification(isOnline ? 'Connection is back online!' : 'You are offline.');
    }
  }

  showNotification(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: this.isOnline ? 'online-snackbar' : 'offline-snackbar'
    });
  }

  updateStatus(isOnline: boolean) {
    this.isOnline = isOnline;
    this.status = isOnline ? 'Online' : 'Offline';
  }
}