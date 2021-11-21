import { Component, OnInit } from '@angular/core';
import { FileI } from 'src/app/models/fileI';
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

  fileImage: FileI = {}
  isImage = false
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
    if(!this.editing) {
      this.fileImage={}
      this.imageRender=''
    }

  }

  updateProduct() {
    this.productService.updateProductCard(this.editingProduct, this.fileImage)
    this.editingProduct = {} as Product
    
    this.fileImage = {}
    this.imageRender=''
    this.editing = false
  }

  imageRender: any = '';

  onFileChanged(event:any) {
    
    this.fileImage = event.target.files[0]
    //this.isImage = true

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event) => {
      this.imageRender = (<FileReader>event.target).result;
    }
  }


}
