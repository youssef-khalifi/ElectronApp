import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { OnlineStatusComponent } from './components/online-status/online-status.component';

const routes: Routes = [
  {path:'home' , component : HomeComponent},
  {path:'products' , component : ProductsComponent},
  {path:'onlineStatus' , component : OnlineStatusComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
