import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';

import { ProductService } from '../../services/product.service'

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {
  
  products: Product[] = []

  editingProduct: Product = {
    //filePath: ''
  } as Product

  editing: boolean = false

  constructor(public  productService: ProductService ) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(products => {
      //console.log(products)
      this.products = products
    })
  }

  deleteProduct(event: Event, product: Product) {
    if(confirm('Are you sure you wnat to delete it?')) {
      console.log(typeof(product.filePath))
      
      this.productService.deleteFile(product.filePath)
      this.productService.deleteProduct(product)
    
    }
  }

  editProduct(event: Event, product: Product ) {
    this.editingProduct = product
    this.editing = !this.editing
  }

  updateProduct() {
    this.productService.updateProduct(this.editingProduct)
    this.editingProduct = {} as Product
    this.editing = false
  }

}
