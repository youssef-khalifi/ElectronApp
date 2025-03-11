import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Product} from "../models/Product";
import {PlatformService} from "./platform.service";

@Injectable({
  providedIn: 'root'
})
export class SyncService {

  private isBrowser: boolean;
  private readonly Url = "http://localhost:5164/api/Sync/sync-sqlite";

  constructor(private platformService: PlatformService ,
              private http : HttpClient) {
    this.isBrowser = this.platformService.isRunningInBrowser();
  }

  public syncToSqlServer(products : Product[]) : Observable<any>{

    return this.http.post<any>(`${this.Url}` , products)
  }

  async markProductsAsSynced() {
    if (this.isBrowser && window.electronAPI) {
      try {
        // Call the Electron API to delete the product

        const result = await window.electronAPI.markProductsAsSynced();

        // Handle result and return success or failure
        if (result) {
          return result; // This can be a success message or the deleted product ID
        } else {
          console.error("error");
          return result;
        }
      } catch (error) {
        console.error('Error markProductsAsSynced product:', error);
        return null; // You can return null or an empty array based on your preferred error handling
      }
    } else {
      console.error("Electron API not available");
      return null; // Return null or empty array if Electron API is unavailable
    }
  }
}
