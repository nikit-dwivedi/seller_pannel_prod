import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class userListService {

  private apiUrl = environment.apiUrl;
  userInfo: any
  adminToken: any
  constructor(private http: HttpClient) {
    this.adminToken = localStorage.getItem('token');
    // console.log(this.adminToken)
  }


  Header = () => {
    let headers = new HttpHeaders();
    headers = headers.append('content-type', 'application/json');
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Authorization', `Bearer ${JSON.parse(localStorage.getItem('token')) || '{}'} `)
    return { headers };
  }
 
  

}
