import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../models/Product';
import { ConnectivityService } from '../../services/connectivity.service';
import { ElectronService } from '../../services/electron.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent  implements OnInit {

  productForm!: FormGroup;
  product! : Product;

  constructor(private connectivityService : ConnectivityService, 
    private electronService : ElectronService
  ){}

  ngOnInit(): void {

    this.productForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required,]),
      price: new FormControl('', [Validators.required,]),
      check: new FormControl(false)
    });
  }

  onSubmit()
  {
    this.product = {
      id : 0,
      name : this.productForm.value.name,
      description : this.productForm.value.description,
      price : this.productForm.value.price
     }
     
     if(this.connectivityService.getCurrentOnlineStatus())
     {
     // console.log(this.product)
     console.log("send it to server ")
     }else{
     this.electronService.sendProductToMain(this.product)
     }
     
     
  }
}
