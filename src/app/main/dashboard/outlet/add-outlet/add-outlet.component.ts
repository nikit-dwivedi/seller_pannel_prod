import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { OutletServiceService } from 'app/services/outlet-service.service';
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import { ToastrserviceService } from 'app/services/toastrservice.service';
import { Router } from '@angular/router';


const URL = 'https://your-url.com';

@Component({
  selector: 'app-add-outlet',
  templateUrl: './add-outlet.component.html',
  styleUrls: ['./add-outlet.component.scss']
})
export class AddOutletComponent implements OnInit {

  public openingHourdata = { hour: 13, minute: 30 };
  public closingHourdata = { hour: 13, minute: 30 };
  public meridianTP = true;
  Submitted = false;
  addOutletForm: FormGroup;
  cuisineList: any;
  cuisineArray = [];
  selectedImage: any;
  imageURL = [];
  data:any;
  loading:Boolean = false;
  constructor(private outletService: OutletServiceService, private router:Router , private toastr:ToastrserviceService ,private fb: FormBuilder, private modalService: NgbModal) { }

  ngOnInit() {
    this.addOutletForm = this.fb.group({

      outletName: new FormControl('', [Validators.required]),
      outletImage: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      preparationTime: new FormControl('', [Validators.required]),
      area: new FormControl('', [Validators.required]),
      phone: new FormControl('',[Validators.required]),
      isPureVeg: new FormControl('', [Validators.required]),
      shopAddress: new FormControl('', [Validators.required]),
      openingHour: new FormControl('', [Validators.required]),
      closingHour: new FormControl('', [Validators.required]),
      isFood: new FormControl(true,[Validators.required]),
      longitude: new FormControl(0, [Validators.required]),
      latitude: new FormControl(0, [Validators.required])
    });
  }

  get f() {
    return this.addOutletForm.controls;
  }

  outletImage(event: any) {
    this.selectedImage = event.target.files[0];
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageURL.push(event.target.result);
      this.addOutletForm.patchValue({
        fileSource: this.imageURL,
      });
      
    };
    reader.readAsDataURL(event.target.files[0]);
  
  }

  cuisineCheck(cuisineId:any){
    if(this.cuisineArray.includes(cuisineId)){
          return true;
        }
        else{
          return false;
        }
    
      }

  addOutletFormSubmit() {

    this.Submitted = true;
    this.loading = true;
    if (this.addOutletForm.invalid) {
      this.loading = false;
      console.log("Failed");
      
      return;
    }
    else {
      console.log("Success");
      
     
      this.addOutletForm.value.openingHour = this.formatTime(this.addOutletForm.value.openingHour);
      this.addOutletForm.value.closingHour = this.formatTime(this.addOutletForm.value.closingHour)
      this.addOutletForm.value.cuisine = this.cuisineArray;
      // this.addOutletForm.value.outletImage  = this.selectedImage;

      const openingHours: any = [`${this.addOutletForm.value.openingHour} - ${this.addOutletForm.value.closingHour}`]
      const formData = new FormData()
      formData.append("outletName",this.addOutletForm.value.outletName);
      formData.append("outletImage", this.selectedImage);
      formData.append("type",this.addOutletForm.value.type);
      formData.append("preparationTime",this.addOutletForm.value.preparationTime);
      formData.append("area",this.addOutletForm.value.area);
      formData.append("isPureVeg",this.addOutletForm.value.isPureVeg);
      formData.append("cuisines",this.addOutletForm.value.cuisine);
      formData.append("shopAddress",this.addOutletForm.value.shopAddress);
      formData.append("openingHours",openingHours);
      formData.append("longitude",this.addOutletForm.value.longitude);
      formData.append("latitude",this.addOutletForm.value.latitude);
      formData.append("isFood",this.addOutletForm.value.isFood);
      formData.append("phone",this.addOutletForm.value.phone)

      this.outletService.addOutlet(formData).subscribe((res:any)=>{
        if(res.status){
          this.toastr.showSuccess(res.message,"Success!");
          this.loading = false;
          this.router.navigateByUrl('/dashboard/allOutlet');
          this.addOutletForm.reset();
        }else{
          this.toastr.showError(res.message,"error!");
          this.addOutletForm.reset();
        }
      });
}
  }


  modalCuisineAdd(data: any) {
    this.modalService.open(data, {
      centered: true
    });
    this.allCuisine();
  }

  onCuisineSelect(cuisine: any) {
    if (this.cuisineArray.includes(cuisine.cuisineId)) {
      let index = this.cuisineArray.indexOf(cuisine.cuisineId);
      this.cuisineArray.splice(index, 1);
    } else {
      this.cuisineArray.push(cuisine.cuisineId);
    }
   }

  allCuisine() {
    this.outletService.getAllCuisine().subscribe((data: any) => {
      this.cuisineList = data.items;
     });
  }

  formatTime(dateObject: any): any {
    let { hour, minute } = dateObject
    let timeSet = "AM"
    if (hour >= 12) {
      timeSet = "PM"
      hour = hour - 12
    }
    if (hour == 0) {
      hour = 12
    }
    minute = minute == 0 ? `0${minute}` : minute
    return `${hour}:${minute} ${timeSet}`
  }

}
