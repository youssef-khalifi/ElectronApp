// src/app/services/electron.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { PlatformService } from './platform.service';


@Injectable({
  providedIn: 'root',
})
export class ElectronService {
 
  private isBrowser: boolean;

  constructor(private platformService: PlatformService) {
      this.isBrowser = this.platformService.isRunningInBrowser();
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
}