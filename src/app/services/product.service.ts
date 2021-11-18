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
    image: ''
  } as Product


  constructor(public db: AngularFirestore, public storage: AngularFireStorage) {
    // CONSULTA SIN ID
    // this.products = this.db.collection('products').valueChanges()

    //CONSULTA CON ID
    this.productsCollection = this.db.collection('products')

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


  async saveProduct(product: Product, image: FileI) {
    const docRef = await this.productsCollection.add(product)
    this.filePath = `images/${docRef.id}`
    const fileRef = this.storage.ref(this.filePath)

    const task = this.storage.upload(this.filePath, image)

    task.snapshotChanges().pipe(
      finalize( () => {
        fileRef.getDownloadURL().subscribe( urlImage => {
          //this.downloadURL$ = urlImage
          product.image =  urlImage.toString()
          this.updateProduct(this.product)
          console.log('URL_download$:', urlImage)

    //const url = await this.uploadImage(docRef.id, image)
    //this.product.image = this.downloadURL$.subscribe()
          })
      })
    ).subscribe()
  }


  async uploadImage(name: String, image: FileI) {

    this.filePath = `images/${name}`
    const fileRef = this.storage.ref(this.filePath)

    const task = this.storage.upload(this.filePath, image)

    const url =  task.snapshotChanges().pipe(
      finalize(  () => {
        fileRef.getDownloadURL().subscribe( urlImage => {
          //this.downloadURL$ = urlImage
          console.log('URL_download$:', urlImage)
          return urlImage.toString()
        })
      })
    ).subscribe()
      return url
  }


  async saveProductv2(product: Product, image: FileI) {

    this.product = product
    this.filePath = `images/${image.name}`
    const fileRef = this.storage.ref(this.filePath)

    const task = this.storage.upload(this.filePath, image)

    task.snapshotChanges().pipe(
      finalize( () => {
        fileRef.getDownloadURL().subscribe( urlImage => {
        
          this.product.image =  urlImage.toString()
          const docRef = this.productsCollection.add(this.product)
          // this.filePath = `images/${docRef.id}`
          // const fileRef = this.storage.ref(this.filePath)
          // console.log('URL_download$:', urlImage)
          //this.setUrl(urlImage.toString())
          //return urlImage.toString()
        })
      })
    ).subscribe()
      
  }


  deleteFileByUrl(url: string) {
    let desertRef = this.storage.ref(url)
    desertRef.delete()
  }

}
