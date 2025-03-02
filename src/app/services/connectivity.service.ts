import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlatformService } from './platform.service';


/*
  ** PLATFORM_ID: Used to check whether the app is running in a browser or server-side environment (important for Angular Universal).
  
  ** BehaviorSubject<boolean>: Stores the online status and allows real-time subscription to connectivity changes.
*/
@Injectable({
  providedIn: 'root'
})
export class ConnectivityService implements OnInit, OnDestroy {

  private onlineStatus = new BehaviorSubject<boolean>(true); // Default to true
  public onlineStatus$ = this.onlineStatus.asObservable();
  private isBrowser: boolean;  // true if the app is running in a browser
  private connectivityCheckInterval: any = null;

  ngOnInit(): void {}

  constructor(private platformService: PlatformService) {
    this.isBrowser = this.platformService.isRunningInBrowser(); // Use PlatformService to check if the app is in the browser

    if (this.isBrowser) {
      // Initial check
      this.checkRealConnectivity();

      // Set up event listeners for online/offline events
      window.addEventListener('online', () => this.checkRealConnectivity());
      window.addEventListener('offline', () => this.updateOnlineStatus(false));

      // Periodically check real connectivity
      this.connectivityCheckInterval = setInterval(() => this.checkRealConnectivity(), 10000); // Check every 30 seconds
    }
  }

  private checkRealConnectivity(): void {
    if (!this.isBrowser) return;

    if (!navigator.onLine) {
      // If browser says we're offline, trust it
      this.updateOnlineStatus(false);
      return;
    }

    // Make a fetch request to check real connectivity
    fetch('https://www.google.com/generate_204', { 
      mode: 'no-cors',
      cache: 'no-store'
    })
    .then(() => {
      // Successfully connected
      this.updateOnlineStatus(true);
    })
    .catch(() => {
      // Failed to connect
      this.updateOnlineStatus(false);
    });
  }

  private updateOnlineStatus(status: boolean): void {
    this.onlineStatus.next(status);

    // Send status to Electron main process
    if (this.isBrowser && window.electronAPI) {
      window.electronAPI.sendOnlineStatus(status);
    }
  }

  ngOnDestroy(): void {
    if (this.connectivityCheckInterval) {
      clearInterval(this.connectivityCheckInterval);
    }
  }

  sendUserToMain(user: any) {
    if (this.isBrowser && window.electronAPI) {
      window.electronAPI.sendUser(user);
    } else {
      console.error("Electron API not available");
    }
  }

  sendProductToMain(product: any) {
    if (this.isBrowser && window.electronAPI) {
      window.electronAPI.addProduct(product);
    } else {
      console.error("Electron API not available");
    }
  }

  // Public method to manually check connectivity
  checkConnectivity() {
    this.checkRealConnectivity();
  }

  getCurrentOnlineStatus(): boolean {
    return this.onlineStatus.getValue(); // Return the current value of the online status
  }
}
