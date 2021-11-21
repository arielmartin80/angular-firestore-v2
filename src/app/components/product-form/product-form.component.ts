import { Component, OnInit } from '@angular/core';
import { FileI } from 'src/app/models/fileI';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';


@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  product = {
    //urlImage: ''
  } as Product

  fileImage!: FileI
  isImage = false

  constructor(public productService: ProductService) { }

  ngOnInit(): void {
  }

  addProduct() {
    if (this.product.name) {

      this.productService.saveProduct(this.product, this.fileImage)
      console.log('product added')
  
      this.product = { filePath: ''}
      this.isImage = false

    }else{
      console.log('Faltan datos')
    }
  }

  imageRender: any = '';

  onFileChanged(event:any) {
    
    this.fileImage = event.target.files[0]
    this.isImage = true

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event) => {
      this.imageRender = (<FileReader>event.target).result;
    }
  }

  

}
