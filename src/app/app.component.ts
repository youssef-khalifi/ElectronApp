import {Component, HostListener, OnInit} from '@angular/core';
import { ElectronService } from './services/electron.service';
import {ConnectivityService} from "./services/connectivity.service";
import {SyncService} from "./services/sync.service";
import {PlatformService} from "./services/platform.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  implements OnInit {

  constructor(private connectivityService : ConnectivityService,
              private syncService : SyncService,
              private electronService : ElectronService) {}


  ngOnInit() {

  }

  @HostListener('window:offline', ['$event'])
  onOffline(event: Event): void {
    alert('User is offline');
  }

  @HostListener('window:online', ['$event'])
  onOnline(event: Event): void {
    alert('User is online');
    this.syncToSqlServer().then()
  }

  async syncToSqlServer(){
    const products = this.electronService.getUnSyncProducts()
    this.syncService.syncToSqlServer(await products).subscribe({
      next : (data) => {

        console.log(data)
        this.syncService.markProductsAsSynced()
      },
      error : (error) => {
        console.log(error)
      }
    })
  }
}
