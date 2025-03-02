import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../models/Product';
import { ConnectivityService } from '../../services/connectivity.service';
import { ElectronService } from '../../services/electron.service';
import { ProductRequest } from '../../models/ProductRequest';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent  implements OnInit {

  productForm!: FormGroup;
  products: any[] = [];
  product! : ProductRequest;
  product2! : Product;

  constructor(private connectivityService : ConnectivityService, 
    private electronService : ElectronService
  ){}

  ngOnInit(): void {

    this.loadProducts();
    
    this.productForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required,]),
      price: new FormControl('', [Validators.required,]),
      check: new FormControl(false)
    });

  }

  async loadProducts() {
    this.products = await this.electronService.getAllProducts();
    console.log('Loaded products:', this.products);
  }

  onSubmit()
  {
    this.product = {
      name : this.productForm.value.name,
      description : this.productForm.value.description,
      price : this.productForm.value.price
     }
     
     if(this.connectivityService.getCurrentOnlineStatus())
     {
     // console.log(this.product)
     console.log("send it to server ")
     }else{
     this.electronService.addProduct(this.product)
     }
     
     
  }

  edit(product : Product){
    alert(product.name)
  }

  delete(product : Product){
    alert(product.name)
  }
}
