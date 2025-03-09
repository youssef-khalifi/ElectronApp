// src/app/services/electron.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { PlatformService } from './platform.service';
import { ProductRequest } from '../models/ProductRequest';


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

  async addProduct(product: ProductRequest) {
    if (this.isBrowser && window.electronAPI) {
      try {
        const result = await window.electronAPI.addProduct(product);
        return result;
      } catch (error) {
        console.error("Error adding product:", error);
      }
    } else {
      console.error("Electron API not available");
    }
  }

  async getProduct(productId: string) {
    if (this.isBrowser && window.electronAPI) {
      try {
        const product = await window.electronAPI.getProduct(productId);
        return product;
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    } else {
      console.error("Electron API not available");
    }
  }

  // src/app/services/electron.service.ts
async getAllProducts() {
  if (this.isBrowser && window.electronAPI) {
    try {
      const products = await window.electronAPI.getAllProducts();
      return products;
    } catch (error) {
      console.error('Error fetching all products:', error);
      return [];
    }
  } else {
    console.error("Electron API not available");
    return [];
  }
}

}