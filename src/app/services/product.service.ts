import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Product} from "../models/Product";
import {ProductRequest} from "../models/ProductRequest";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly Url = "http://localhost:5164/api/Product";

  constructor(private http : HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.Url}`)
  }

  addProduct(product : ProductRequest) : Observable<Product>{

    return this.http.post<Product>(`${this.Url}` , product)
  }

  deleteProduct(id : number) : Observable<any> {

    return this.http.delete<any>(`${this.Url}/${id}`)
  }
}
