import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment.prod';
import {map} from "rxjs/operators";
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OutletServiceService {

  private menuUrl = environment.menuUrl;
  private sellerApi = environment.sellerApi;
  private userUrl = environment.userUrl;
  private adminUrl=environment.adminUrl;
  adminToken: any;
  constructor(private http: HttpClient) {
    this.adminToken = localStorage.getItem('token');

   }

   Header = () => {
    // console.log(localStorage.getItem('token'));
    
    let headers = new HttpHeaders();
    // headers = headers.append('content-type', 'application/json');
    // headers = headers.append('Accept', 'application/json');
    headers = headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`)
    
    return { headers };
  }
  
// add new seller outlet
addOutlet(body:any){
 return this.http.post(this.menuUrl + 'outlet' , body , this.Header()).pipe(map((data:any)=>{
   return data;
    
  }))
}
// get all outlet
getAllOutlet(mode:any){
  return this.http.get(this.menuUrl + `outlet/seller?mode=${mode}` ,this.Header()).pipe(map((data:any)=>{
    return data;
  }));
}

// get outlet by outlet id
getOutletDetailsByID(outletId:any){
  return this.http.get(this.menuUrl + 'outlet/single/' + outletId , this.Header()).pipe(map((data:any)=>{
    return data;
  }));
}

// get all cuisine
getAllCuisine(){
  return this.http.get(this.menuUrl + 'outlet/cuisine' ,this.Header()).pipe(map((data:any)=>{
    return data;
  }));
}

// change outlet status
chageOutletStatus(outletId:any){
  return this.http.get(this.menuUrl + 'outlet/status/' + outletId , this.Header()).pipe(map((data:any)=>{
    return data;
  }));
}

// edit outlet
editOutlet(outletId:any,body:any){
  return this.http.post(this.menuUrl + 'outlet/update/' + outletId , body, this.Header()).pipe(map((data:any)=>{
    return data;
  }
  ));
}

// add new discount
addNewDiscount(body:any){
  return this.http.post(this.menuUrl + 'discount/' , body , this.Header()).pipe(map((data:any)=>{
    return data;
  }))
}
// get all promotions
getAllOffer(){
  return this.http.get(this.menuUrl + 'discount/',  this.Header()).pipe(map((data:any)=>{
    return data;
  }));
}

// get all offer by seller
getOutletOffer(outletId:any){
  return this.http.get(this.menuUrl + 'outlet/discount/' + outletId , this.Header()).pipe(map((data:any)=>{
    return data;
  }));
}

// add seller offer to outlet
addSellertoOutlet(body:any){
  return this.http.post(this.menuUrl + 'outlet/discount' , body , this.Header()).pipe(map((data:any)=>{
    return data;
  }));
}

// remove discpount from outlet
removeDisount(body:any){
  return this.http.post(this.menuUrl + 'outlet/discount/remove' , body , this.Header()).pipe(map((data:any)=>{
    return data;
  }));
}

// get all order of outlet
outletOrderHistory(outletId:any,status:any,from:any,to:any){
  return this.http.get(this.sellerApi + 'outlet/' + outletId + `?status=${status}&from=${from}&to=${to}` ,this.Header()).pipe(map((data:any)=>{
    return data;
  }));
}

// get seller info
getSellerInfo(){
  return this.http.get(this.userUrl + '/v1/seller/info' , this.Header()).pipe(map((data:any)=>{
    return data;
  }))
}

// get outlet menu category
getAllCategory(outletId:any){
  return this.http.get(this.menuUrl + '/menu/category/' + outletId , this.Header()).pipe(map((data:any)=>{
    return data;
  }));
}

// get subcategory by category id
getSubCategory(categoryId:any){
  return this.http.get(this.menuUrl + '/menu/sub-category/' + categoryId , this.Header()).pipe(map((data:any)=>{
    return data;
  }));
}

// get product by categoryID
getProductById(categoryId:any){
  return this.http.get(this.menuUrl + '/menu/prod/' + categoryId , this.Header()).pipe(map((data:any)=>{
    return data;
  }));
}

// get out of stock product
getOutOfStockProduct(body:any){
  return this.http.post(this.menuUrl + '/menu/stock' , body ,this.Header()).pipe(map((data:any)=>{
    return data;
  }))
}
// change product stock status
chnageStockStatus(productId:any){
  return this.http.get(this.menuUrl + '/menu/stock/' + productId , this.Header()).pipe(map((res:any)=>{
    return res;
  }))
}

// add category / subcategory by outlet id
addCategory(body:any){
  return this.http.post(this.menuUrl + '/menu/category' , body ,this.Header()).pipe(map((data:any)=>{
    return data;
  }));
}

// edit category /subcategory by category id
editCategory(body:any){
  return this.http.post(this.menuUrl + '/menu/category/edit' , body , this.Header()).pipe(map((data:any)=>{
    return data;
  }))
}

// add product by categoryId
addProduct(body:any){
  return this.http.post(this.menuUrl + '/menu/product' , body , this.Header()).pipe(map((data:any)=>{
    return data
  }));
}

// edit product by product id
editProduct(productId:any,body:any){
  return this.http.post(this.menuUrl + '/menu/product/edit/' + productId , body ,this.Header()).pipe(map((data:any)=>{
    return data;
  }))
}
// get product customiation by productId
getCusomization(productId:any){
  return this.http.get(this.menuUrl + '/menu/customization/' + productId , this.Header()).pipe(map((data:any)=>{
    return data;
  }));
}

// add variation by productId
addVariatiom(body:any){
  return this.http.post(this.menuUrl + '/menu/customization' , body , this.Header()).pipe(map((data:any)=>{
    return data;
  }));
}

// edit variation by variationId
editVariation(variationId:any,body:any){
  return this.http.post(this.menuUrl + '/menu/customization/edit/' + variationId , body , this.Header()).pipe(map((data:any)=>{
    return data;
  }));
}

// edit variant by variationId
editVariant(body:any){
  return this.http.post(this.menuUrl + '/menu/customitem/edit' , body , this.Header()).pipe(map((data:any)=>{
    return data;
  }));
}

// add variant by variationId
addVariant(body:any){
  return this.http.post(this.menuUrl + '/menu/customitem' , body,this.Header()).pipe(map((data:any)=>{
    return data;
  }));
}

// get outlet addon
getOutletAddon(outletId:any){
  return this.http.get(this.menuUrl + '/menu/addOn/' + outletId , this.Header()).pipe(map((data:any)=>{
    return data;
  }));
}

// get product addon
getProductAddon(productId:any){
  return this.http.get(this.menuUrl + '/menu/product/addOn/' + productId , this.Header()).pipe(map((data:any)=>{
   return data;
  }));
}

// add addon category
addAddonCategory(body:any){
  return this.http.post(this.menuUrl + '/menu/addOn/Category' , body , this.Header()).pipe(map((data:any)=>{
    return data;
  }));
}

// edit addon category
editAddonCategory(body:any){
  return this.http.post(this.menuUrl + '/menu/addOn/Category/edit' , body , this.Header()).pipe(map((res:any)=>{
    return res;
  }));
}

// link outlet addon to product
linkUnLink(body:any){
  return this.http.post(this.menuUrl + '/menu/product/addOn' , body , this.Header()).pipe(map((data:any)=>{
    return data;
  }));
}

// add addon product 
addNewproduct(body:any){
  return this.http.post(this.menuUrl + '/menu/addOn/product' , body , this.Header()).pipe(map((data:any)=>{
    return data;
  }));
}

// edit addon product
editaddonProduct(body:any){
  return this.http.post(this.menuUrl + '/menu/addOn/product/edit' , body ,this.Header()).pipe(map((data:any)=>{
    return data;
  }));
}

// creat ticket
creatTicket(body:any){
  return this.http.post(this.adminUrl + '/v1/support/' , body , this.Header()).pipe(map((data:any)=>{
    return data;
  }));
}

// total earning of outlet
outletEaring(outletId:any,from:any,to:any){
  return this.http.get(this.sellerApi + '/outlet/' + outletId + `/profit?from=${from}&to=${to}` , this.Header()).pipe(map((data:any)=>{
    return data;
  }));
}

// delete any data
deletData(body:any){
  return this.http.post(this.menuUrl + 'delete' , body , this.Header()).pipe(map((res:any)=>{
    return res;
  }))
}
}

 