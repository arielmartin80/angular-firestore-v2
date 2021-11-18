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
    image: ''
  } as Product

  fileImage!: FileI
  isImage = false

  constructor(public productService: ProductService) { }

  ngOnInit(): void {
    //this.productService.deleteFile('images/undefined')
  }

  async addProduct() {
    if (this.product.name !== '' && this.product.description !== '' && this.product.price !== 0) {
      
      this.productService.saveProductv2(this.product, this.fileImage)
      //const x = await this.productService.uploadImage('test', this.fileImage)
      //console.log(x)
    }else{
      console.log('Faltan datos')
    }
  }

  imageRender: any = '';

  onFileChanged(event:any) {
    
    this.fileImage = event.target.files[0]
    this.isImage = true
    //this.product.image = event.target.files[0]
    //console.log(event.target.files[0].name)

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event) => {
      this.imageRender = (<FileReader>event.target).result;
    }
  }

  

}
