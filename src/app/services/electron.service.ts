// src/app/services/electron.service.ts
import {Injectable} from '@angular/core';
import {PlatformService} from './platform.service';
import {ProductRequest} from '../models/ProductRequest';


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
        return await window.electronAPI.addProduct(product);
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
      return await window.electronAPI.getAllProducts();
    } catch (error) {
      console.error('Error fetching all products:', error);
      return [];
    }
  } else {
    console.error("Electron API not available");
    return [];
  }
}

  async getUnSyncProducts(){

    if (this.isBrowser && window.electronAPI) {
      try {
        return await window.electronAPI.getUnSyncProducts();
      } catch (error) {
        console.error('Error fetching all UnSync products:', error);
        return [];
      }
    } else {
      console.error("Electron API not available");
      return [];
    }
  }

  async deleteProduct(productId: number) {
    if (this.isBrowser && window.electronAPI) {
      try {
        // Call the Electron API to delete the product
        const result = await window.electronAPI.deleteProduct(productId);

        // Handle result and return success or failure
        if (result) {
          return result; // This can be a success message or the deleted product ID
        } else {
          console.error("No product deleted");
          return null;
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        return null; // You can return null or an empty array based on your preferred error handling
      }
    } else {
      console.error("Electron API not available");
      return null; // Return null or empty array if Electron API is unavailable
    }
  }





}
