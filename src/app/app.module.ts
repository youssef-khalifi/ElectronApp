import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ElectronService } from './services/electron.service';
import { ProductsComponent } from './components/products/products.component';
import { OnlineStatusComponent } from './components/online-status/online-status.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from "@angular/common/http";
import { ToothComponent } from './components/tooth/tooth.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    OnlineStatusComponent,
    HomeComponent,
    NavbarComponent,
    ToothComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    provideClientHydration(),
    ElectronService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
