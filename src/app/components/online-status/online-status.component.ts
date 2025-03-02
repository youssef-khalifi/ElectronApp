import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConnectivityService } from '../../services/connectivity.service';
import { PlatformService } from '../../services/platform.service';

@Component({
  selector: 'app-online-status',
  templateUrl: './online-status.component.html',
  styleUrl: './online-status.component.css'
})
export class OnlineStatusComponent implements OnInit , OnDestroy {

  isOnline: boolean = true;
  private subscription: Subscription | null = null; // Stores the RxJS subscription to handle network status updates
  private isBrowser: boolean; // Stores whether the app is running in a browser.

  constructor(
    private electronService: ConnectivityService, 
    private platformService: PlatformService // Inject PlatformService
  ) {
    this.isBrowser = this.platformService.isRunningInBrowser(); // Use PlatformService to check if in a browser
  }


  ngOnInit(): void {
    if (this.isBrowser) {
      this.subscription = this.electronService.onlineStatus$.subscribe(
        status => {
          this.isOnline = status;
        }
      );
    }
  }

  refreshStatus(): void {
    this.electronService.checkConnectivity();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  

}
