import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore'
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators'
import { FileI } from '../models/fileI';

import { Product } from '../models/product'

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  productsCollection: AngularFirestoreCollection<Product>
  products: Observable<Product[]>
  productDoc?: AngularFirestoreDocument<Product>

  private filePath!: string
  private downloadURL$!: Observable<String>
  product = {
    //urlImage: ''
  } as Product


  constructor(public db: AngularFirestore, public storage: AngularFireStorage) {
    // CONSULTA SIN ID
    // this.products = this.db.collection('products').valueChanges()

    //CONSULTA CON ID y query
    this.productsCollection = this.db.collection('products',queryFn => queryFn.orderBy('filePath', 'desc'))


    this.products = this.productsCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Product
        data.id = a.payload.doc.id
        return data
      })
    }))
  }


  getProducts() {
    return this.products
  }


  async getProduct(id: string) {
    const productDoc = await this.db.doc(`products/${id}`)
    return productDoc
  }


  deleteProduct(product: Product) {
    this.productDoc = this.db.doc(`products/${product.id}`)
    this.productDoc.delete()
  }


  updateProduct(product: Product) {
    this.productDoc = this.db.doc(`products/${product.id}`)
    this.productDoc.update(product)
  }



  // async uploadImage(name: String, image: FileI) {

  //   this.filePath = `images/${name}`
  //   const fileRef = this.storage.ref(this.filePath)

  //   const task = this.storage.upload(this.filePath, image)

  //   const url =  task.snapshotChanges().pipe(
  //     finalize(  () => {
  //       fileRef.getDownloadURL().subscribe( urlImage => {
  //         //this.downloadURL$ = urlImage
  //         console.log('URL_download$:', urlImage)
  //         return urlImage.toString()
  //       })
  //     })
  //   ).subscribe()
  //     return url
  // }


  async saveProduct(product: Product, image: FileI) {

    this.product = product
    const fileName = new Date().getTime()
    this.product.filePath = `images/${fileName}`
    const fileRef = this.storage.ref(this.product.filePath)

    const task = this.storage.upload(this.product.filePath, image)

    task.snapshotChanges().pipe(
      finalize( () => {
        fileRef.getDownloadURL().subscribe( urlImage => {
        
          this.product.urlImage =  urlImage.toString()
          const docRef = this.productsCollection.add(this.product)
          // console.log('URL_download$:', urlImage)
        })
      })
    ).subscribe()
      
  }


  async updateProductCard(product: Product, image: FileI) {
    
    this.product = product
    console.log('image name: ',image.name)
    if(image.name) {
    
      const fileRef = this.storage.ref(this.product.filePath)
  
      const task = this.storage.upload(this.product.filePath, image)
  
      task.snapshotChanges().pipe(
        finalize( () => {
          fileRef.getDownloadURL().subscribe( urlImage => {
          
            this.product.urlImage =  urlImage.toString()
            this.updateProduct(this.product)
            console.log('se actualizaron datos y foto')
          })
        })
      ).subscribe()
    }
    else {
      this.updateProduct(this.product)
      console.log('solo se actualizaron datos')
    }
      
  }


  deleteFile(filePath: string) {
    let desertRef = this.storage.ref(filePath)
    desertRef.delete()
  }

}


