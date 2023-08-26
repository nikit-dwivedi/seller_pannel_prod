import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment.prod";
import { map } from "rxjs/operators";
import { BehaviorSubject, Observable } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private SellerApi = environment.sellerApi;
  private menuUrl = environment.menuUrl;
  private adminUrl = environment.adminUrl;

  constructor(private http: HttpClient) {}

  Header = () => {
    // console.log(localStorage.getItem('token'));

    let headers = new HttpHeaders();
    headers = headers.append("content-type", "application/json");
    headers = headers.append("Accept", "application/json");
    headers = headers.append(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );
    //  console.log(headers)
    return { headers };
  };

  loginWithMobileNumber(body: any) {
    return this.http.post<any>(this.apiUrl + "login", body).pipe(
      map((user: any) => {
        if (user.status) {
          /*   localStorage.setItem('info', user.items?.user_type)
        localStorage.setItem('token', user.items?.token) */
        }
        return user;
      })
    );
  }

  otpValidate(body: any) {
    return this.http.post(this.apiUrl + "verify", body).pipe(
      map((user: any) => {
        if (user.status) {
          localStorage.setItem("token", user.items?.token);
        }
        return user;
      })
    );
  }

  // change outlet status
  changeOutletStatus(outletId: any) {
    return this.http
      .get(this.menuUrl + "outlet/status/" + outletId, this.Header())
      .pipe(
        map((list: any) => {
          return list;
        })
      );
  }

  getAllSeller() {
    return this.http.get<any>(this.SellerApi + "seller", this.Header()).pipe(
      map((list: any) => {
        return list;
      })
    );
  }

  // accept order
  getAcceptOrder(body: any) {
    return this.http
      .post<any>(this.SellerApi + "status", body, this.Header())
      .pipe(
        map((list: any) => {
          return list;
        })
      );
  }

  // get all order of seller
  getAllOrderofSeller(status: any) {
    return this.http
      .get(this.SellerApi + `/seller?status=${status}`, this.Header())
      .pipe(
        map((list: any) => {
          return list;
        })
      );
  }

  // get seller outlet
  getSellerOutlet(mode: any) {
    return this.http
      .get(this.menuUrl + `outlet/seller?mode=${mode}`, this.Header())
      .pipe(
        map((list: any) => {
          return list;
        })
      );
  }

  // get all cuisine
  getAllCuisine() {
    return this.http.get(this.menuUrl + "outlet/cuisine", this.Header()).pipe(
      map((list: any) => {
        return list;
      })
    );
  }

  // add seller outlet
  addOutlet(body: any) {
    return this.http.post(this.menuUrl + "outlet", body, this.Header()).pipe(
      map((data: any) => {
        return data;
      })
    );
  }

  // edit outlet
  editOutletById(outletId: any, body: any) {
    return this.http
      .post(this.menuUrl + "outlet/update/" + outletId, body, this.Header())
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }
  // change outlet status
  changeOutletstatus(outletId: any) {
    return this.http
      .get(this.menuUrl + "outlet/status/" + outletId, this.Header())
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  // get all ticket details
  getAllTicket(status: any) {
    return this.http
      .get(this.adminUrl + `/v1/support?status=${status}`, this.Header())
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }

  // view ticket details
  ViewTicketDetails(ticketId: any) {
    return this.http
      .get(this.adminUrl + "/v1/support/details/" + ticketId, this.Header())
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }

  // get All data home page
  allDataHomePage() {
    return this.http.get(this.SellerApi + "seller/profit", this.Header()).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
}
