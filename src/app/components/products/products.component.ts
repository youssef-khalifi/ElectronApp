import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../models/Product';
import { ConnectivityService } from '../../services/connectivity.service';
import { ElectronService } from '../../services/electron.service';
import { ProductRequest } from '../../models/ProductRequest';
import {ProductService} from "../../services/product.service";

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
    private electronService : ElectronService, private productService : ProductService
  ){}

  ngOnInit(): void {

    this.getProducts();

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
      name : this.productForm.value.name,
      description : this.productForm.value.description,
      price : this.productForm.value.price
     }

     if(this.connectivityService.getCurrentOnlineStatus())
     {
    this.productService.addProduct(this.product).subscribe({

    next : (data) =>{
      console.log(data)
      this.productForm.reset()
      this.getProducts()
    },
    error : (error) =>{
      alert(error)
    }
    })
     }else{
     this.electronService.addProduct(this.product).then(()=>{
       this.loadProducts().then()
     })
     }


  }

  edit(product : Product){
    alert(product.name)
  }

  delete(product : Product){

    if(this.connectivityService.getCurrentOnlineStatus())
    {
      this.productService.deleteProduct(product.id).subscribe(
        response => {
          console.log('Product deleted successfully', response);
          this.getProducts()

        },
        error => {
          console.error('Error deleting product', error);
        }
      );

    }else {
      this.electronService.deleteProduct(product.id).then(p =>{
        this.loadProducts().then()
      })
    }

  }

  public getProducts()
  {
    if (this.connectivityService.getCurrentOnlineStatus())
    {
      this.productService.getAllProducts().subscribe({

        next : (data : Product[]) => {
          this.products = data;
        },
        error : (error) => {
          alert(error)
        }
      })
    }else
    {
      this.loadProducts();
    }

  }

  public async loadProducts() {
    this.products = await this.electronService.getAllProducts();

    console.log('Loaded products:', this.products);
  }

}
