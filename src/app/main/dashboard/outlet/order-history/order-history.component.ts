import { Component, OnInit } from '@angular/core';
import { Options } from 'flatpickr/dist/types/options';
import { Navigation, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { OutletServiceService } from 'app/services/outlet-service.service';
import { FormGroup , FormBuilder, FormControl, Validators} from '@angular/forms';
import { ToastrserviceService } from 'app/services/toastrservice.service';
@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  public DateRangeOptions: Options = {
    altInput: true,
    mode: 'range'
  };
  creatTicketForm: FormGroup;
  Submitted:Boolean = false;
  outletData: any;
  start: any;
  end: any;
  orderStatus = 'all';
  ordersList: any;
  isShow: Boolean = false
  orderView: any;
  timingData: any;
  initTime: any;
  pendingTime: any;
  preparingTime: any;
  readyTime: any;
  dispatchedTime: any;
  deliveredTime: any;
  cancelledTime: any;
  deliveredDate: any;
  cancelledDate: any;
  orderData: any;
  timing: any;
  orderTiming: any;
  cancelTiming: any;
  Date: any;
  allOrder: any;
  orderDetails: any;
  constructor(private outletService: OutletServiceService, private toastr:ToastrserviceService , private fb:FormBuilder ,private modalService: NgbModal , private router: Router) {
    let nav: Navigation = this.router.getCurrentNavigation();
    if (nav.extras && nav.extras.state && nav.extras.state.outletData) {
      this.outletData = nav.extras.state.outletData;
    } else {
      this.router.navigate(["/dashboard/allOutlet"]);
    }
  }

  ngOnInit(): void {
    var from = new Date();
    from.setDate(from.getDate() - 5);
    this.start = moment(from).format("MM-DD-YYYY");
    this.end = moment(new Date()).format("MM-DD-YYYY");
    this.getAllOrders();

    this.creatTicketForm = this.fb.group({
      issue:new FormControl('',[Validators.required]),
      description:new FormControl('',[Validators.required])
    });

  }

  get ticket(){
    return this.creatTicketForm.controls;
  }

  getDate(event: any) {
    var date = event.target.value;
    const [from, to] = date.split("to");
    this.start = moment(from).format("MM-DD-YYYY");
    this.end = moment(to).format("MM-DD-YYYY");
    if (this.end) {
      this.getAllOrders();
    }
  }

  getOrderStatus(event: any) {
    this.orderStatus = event.target.value;
    this.isShow = false;
    this.getAllOrders();
  }

  getAllOrders() {
    this.outletService.outletOrderHistory(this.outletData.outletId, this.orderStatus, this.start, this.end).subscribe((data: any) => {
      this.ordersList = data.items?.orderData;
      this.allOrder = this.ordersList;
     });
  }

  // view order details
  viewOrderDetails(order: any) {


    this.isShow = true;

    this.orderView = order;
    this.timingData = this.orderView.timing
    this.initTime = this.timingData?.filter((t: { status: string; }) => t.status === 'init').map(t => t.time);
    this.pendingTime = this.timingData?.filter((t: { status: string; }) => t.status === 'pending').map(t => t.time);
    this.preparingTime = this.timingData?.filter((t: { status: string; }) => t.status === 'preparing').map(t => t.time);
    this.readyTime = this.timingData?.filter((t: { status: string; }) => t.status === 'ready').map(t => t.time);
    this.dispatchedTime = this.timingData?.filter((t: { status: string; }) => t.status === 'dispatched').map(t => t.time);
    this.deliveredTime = this.timingData?.filter((t: { status: string; }) => t.status === 'delivered').map(t => t.time);
    this.cancelledTime = this.timingData?.filter((t: { status: string; }) => t.status === 'cancelled').map(t => t.time);

  }

  closeDetails() {
    this.isShow = false;
  }


  // get order status button color
  buttonClass(status: any) {
    switch (status) {
      case "pending":
        return "badge-light-warning";
      case "preparing":
        return "badge-light-info";
      case "ready":
        return "badge-light-secondary";
      case "dispatched":
        return "badge-light-dark";
      case "delivered":
        return "badge-light-success";
      case "cancelled":
        return "badge-light-danger";

    }
  }

  SelectPaymentColor(paymentStatus: any) {
    switch (paymentStatus) {
      case "Not Collected":
        return "badge-light-danger"
      case "Collected":
        return "badge-light-success"
    }
  }

  // open creat ticket Modal
  openCretTicketModal(data:any,order:any){
    this.modalService.open(data,{
      centered:true,
      scrollable:true,
      size:'md'
    });
    this.orderDetails = order;
    
  }

  creatTicketFormSubmit(){
    this.Submitted = true;
    if(this.creatTicketForm.invalid){
      return;
    }
    else{
      const formData = {
        "orderId":this.orderDetails.orderId,
        "issue":this.creatTicketForm.value.issue,
        "description":this.creatTicketForm.value.description
      }
      
      this.outletService.creatTicket(formData).subscribe((res:any)=>{
        if(res.status){
          this.toastr.showSuccess(res.message,"Success!");
          this.modalService.dismissAll();
          this.creatTicketForm.reset();
        }
        else{
          this.toastr.showError(res.message,"error!");
        }
      });
    }
  }







  filterUpdate(event: any) {
    const val = event.target.value.toLowerCase();
    const temp = this.allOrder.filter(function (d) {
      return d.orderId?.toLowerCase().indexOf(val) !== -1 || d.client.clientName?.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.ordersList = temp;
  }
  downloadCSV(event: any) { }
}
