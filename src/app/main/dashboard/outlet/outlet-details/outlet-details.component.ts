import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router, Navigation } from '@angular/router';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { OutletServiceService } from 'app/services/outlet-service.service';
import { ToastrserviceService } from 'app/services/toastrservice.service';
import { Options } from 'flatpickr/dist/types/options';
import moment from 'moment';

const URL = 'https://your-url.com';

@Component({
  selector: 'app-outlet-details',
  templateUrl: './outlet-details.component.html',
  styleUrls: ['./outlet-details.component.scss']
})

export class OutletDetailsComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({
    url: URL,
    isHTML5: true
  });

// decorator
@ViewChild(DatatableComponent) table: DatatableComponent;

  public DateRangeOptions: Options = {
    altInput: true,
    mode: 'range'
  };
  rows: any;
  rows1: any;
  rows2: any;
  data = [];
  data1 = [];
  data2 = [];
  filteredData = [];
  filteredData1 = [];
  filteredData2 = [];
  private tempData = [];
  private tempData1 = [];
  private tempData2 = [];
  public kitchenSinkRows: any;
  public kitchenSinkRows1: any;
  public kitchenSinkRows2: any;
  public basicSelectedOption: number = 5;
  public ColumnMode = ColumnMode;
  public expanded = {};
  private exportCSVData: [] | any;
  public chkBoxSelected = [];
  public SelectionType = SelectionType;

  public openingHourdata = { hour: 13, minute: 30 };
  public closingHourdata = { hour: 13, minute: 30 };
  public meridianTP = true;
  modalRef: NgbModalRef;
  outletDetails: any;
  outletData: any;
  shopTime: any;
  openingHoursValue: any;
  openingTime: any;
  closingTime: any;
  sellerOfferList: [];
  outletOffer: any;
  outletOfferList = []
  linkById: any;
  outOfProduct: any;
  productId: any;
  start: any;
  end: any;
  outletEarnings: any;
  cols: any;
  constructor(private router: Router, private toastr: ToastrserviceService, private modalService: NgbModal, private outletService: OutletServiceService) {
    let nav: Navigation = this.router.getCurrentNavigation();
    if (nav.extras && nav.extras.state && nav.extras.state.outletDetails) {
      this.outletDetails = nav.extras.state.outletDetails;
    } else {
      this.router.navigate(["/dashboard/allOutlet"]);
    }
  }

  ngOnInit(): void {
    var from = new Date();
    from.setDate(from.getDate() - 5);
    this.start = moment(from).format("MM-DD-YYYY");
    this.end = moment(new Date()).format("MM-DD-YYYY");
    this.getOutletDetails();
    this.outletEarning();
  }

  // redirect to order history page 
  orderHistoryPage() {
    const outletData = this.outletDetails
    this.router.navigate(["/dashboard/orderHistory"], { state: { outletData } });
  }

  getOutletDetails() {
    this.outletService.getOutletDetailsByID(this.outletDetails.outletId).subscribe((data: any) => {
      this.outletData = data.items;
      this.shopTime = this.outletData.openingHours;
      this.openingHoursValue = this.shopTime["0"][0];
      const [startTime, endTime] = this.openingHoursValue.split(" - ");
      this.openingTime = startTime;
      this.closingTime = endTime;
    });
  }

  getDate(event:any){
    var date = event.target.value;
    const [from, to] = date.split("to");
    this.start = moment(from).format("MM-DD-YYYY");
    this.end = moment(to).format("MM-DD-YYYY");
    
    this.outletEarning();
  }

  outletEarning(){
    this.outletService.outletEaring(this.outletDetails.outletId, this.start,this.end).subscribe((data:any)=>{
      this.outletEarnings = data.items;
      console.log(this.outletEarnings);
    });

    
  }
  // open out of stock Modal
  openOutofStockModal(data: any) {
    this.modalService.open(data, {
      centered: true,
      scrollable: true,
      size: 'lg'
    });
    this.outOfStockProduct();
  }

  outOfStockProduct() {
    const form = {
      outletId: this.outletDetails.outletId
    }
    this.outletService.getOutOfStockProduct(form).subscribe((data: any) => {
      this.outOfProduct = data.items;
      this.rows2 = data.items;
      this.tempData2 = this.rows2;
      this.kitchenSinkRows2 = this.rows2;
      this.data2 = this.outOfProduct;
      this.filteredData2 = this.outOfProduct;
    });
  }

  // open change status Modal
  openChangStockModal(data: any, product: any) {
    this.modalRef = this.modalService.open(data, {
      centered: true,
      scrollable: true,
      size: 'lg'
    });
    this.productId = product.productId;
  }

  chnageStockStatus() {
    this.outletService.chnageStockStatus(this.productId).subscribe((res: any) => {
      if (res.status) {
        this.toastr.showSuccess(res.message, "Success!");
        this.modalRef.close();
        this.outOfStockProduct();
      } else {
        this.toastr.showError(res.message, "error!");
      }
    })
  }

  modalCuisineAdd(data: any) {
    this.modalService.open(data, {
      centered: true
    })
  }

  openOfferModal(data: any) {
    this.modalService.open(data, {
      centered: true,
      scrollable: true,
      windowClass: "product-detail-modal",
      size: 'lg'
    });
    this.getSellerOffer();
    this.outletOffers();
  }


  openEarningModal(data:any){
    this.modalRef = this.modalService.open(data,{
      centered:true,
      scrollable:true,
      size:'md'
    })
  }
  getSellerOffer() {
    this.outletService.getAllOffer().subscribe((data: any) => {
      this.sellerOfferList = data.items;
      this.rows = data.items;
      this.tempData = this.rows;
      this.kitchenSinkRows = this.rows;
      this.data = this.sellerOfferList;
      this.filteredData = this.sellerOfferList;
    });
  }

  outletOffers() {
    this.outletService.getOutletOffer(this.outletDetails.outletId).subscribe((data: any) => {
      this.outletOffer = data.items;
    });
  }

  // open link offer Modal
  openLinkOfferModal(data: any, offer: any) {
    this.modalService.open(data, {
      centered: true,
      scrollable: true,
      size: 'md'
    });
    this.linkById = offer.discountId;
  }


  openUnlinkModal(data: any) {
    this.modalService.open(data, {
      centered: true,
      scrollable: true,
      size: 'lg'
    });
  }

  linkOffer() {
    const formData = {
      "outletId": this.outletDetails.outletId,
      "discountId": this.linkById
    }
    this.outletService.addSellertoOutlet(formData).subscribe((data: any) => {
      if (data.status) {
        this.toastr.showSuccess(data.message, "Success!");
        this.outletOffers();

      } else {
        this.toastr.showError(data.message, "error!");
        this.outletOffers();
      }
    });
  }

  unLinkOffer() {
    const formData = {
      "outletId": this.outletDetails.outletId
    }
    this.outletService.removeDisount(formData).subscribe((data: any) => {
      if (data.status) {
        this.toastr.showSuccess(data.message, "Success!");
        this.outletOffers();
      } else {
        this.toastr.showError(data.message, "error!");
        this.outletOffers();
      }
    })
  }

  gotoMenuPage() {
    const outletData = this.outletDetails
    this.router.navigate(["/dashboard/menu"], { state: { outletData } });
  }
  
  filterUpdate(event: any) {
    console.log(event)
    const val = event.target.value.toLowerCase();
    const temp = this.outOfProduct?.filter(function (d:any) {
      return d.productName.toLowerCase().indexOf(val) !== -1 || !val;
      //return d.discountTitle?.toLowerCase().indexOf(val) !== -1 || d.promoCode?.toLowerCase().indexOf(val) !== -1 || d.isCustom?.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.kitchenSinkRows2 = temp;
    this.table.offset = 0;
  }  

}

