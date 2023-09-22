import { Injectable } from '@angular/core';
import { ToastrService, GlobalConfig  } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastrserviceService {
  error(arg0: string) {
    throw new Error('Method not implemented.');
  }
  success(arg0: string) {
    throw new Error('Method not implemented.');
  }

  private options: GlobalConfig;

  constructor(private toastr: ToastrService) {
    this.options = this.toastr.toastrConfig;
   }

 
  showSuccess(message: any, title: any) {    
    this.toastr.success(message, title)
  }


  showError(message: any, title: any) {    
    this.toastr.error(message, title)
  }

  showInfo(message: any, title: any) {    
    this.toastr.info(message, title)
  }

  showWarning(message: any, title: any) {    
    this.toastr.warning(message, title)
  }

}
