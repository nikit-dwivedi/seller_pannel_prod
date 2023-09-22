import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { AuthService } from "app/services/auth.service";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { OutletServiceService } from "app/services/outlet-service.service";

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
})
export class OrdersComponent implements OnInit {
  @ViewChild("content", { static: true }) content: TemplateRef<any>;
  creatTicketForm: FormGroup;
  Submitted: Boolean = false;
  ordersValues: any;
  status: any = "all";
  currentStatus: any;
  orderList: any;
  orderData: any;
  statusData: any;
  orderStatus: any;
  timing: any;
  data: any;
  initTime = [];
  pendingTime = [];
  preparingTime = [];
  readyTime = [];
  dispatchedTime = [];
  deliveredTime = [];
  ischecked = false;
  orderDetails: any;

  orderId: any;
  orderTimes: any[] = [];
 
  // orderArray: any[] = []
  // default: string;
  

  constructor(
    private AuthService: AuthService,
    private outletService: OutletServiceService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {
   
    
  }

  public contentHeader: object;
  ngOnInit(): void {
    
    // console.log(localStorage.getItem('token'))
    this.contentHeader = {
      headerTitle: "Orders",
      actionButton: true,
      breadcrumb: {
        type: "",
        links: [
          {
            name: "Orders",
            isLink: true,
            link: "dashboard/orders",
          },
        ],
      },
    };

    this.getOrder(this.status);

    // creat ticket form
    this.creatTicketForm = this.fb.group({
      issue: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
    });
  }

  get ticket() {
    return this.creatTicketForm.controls;
  }

  changeStatus(orderId: any, orderStatus: any) {
    const formData = {
      orderId: orderId,
      orderStatus: orderStatus,
    };
    this.AuthService.getAcceptOrder(formData).subscribe((data: any) => {
     // console.log("formData", formData);

      if (data.status) {
        this.toastr.success(data.message, "Success!");
        // this.modalService.dismissAll();
        this.getOrder(this.status);
      } else {
        this.toastr.error(data.message, "failed");
      }
    });
  }

  // get all order

  getOrder(status: any) {
    this.status = status;
    this.AuthService.getAllOrderofSeller(this.status).subscribe((data: any) => {
      this.orderList = data.items.orderList;
    });
  }

  // Helper function to get the time for a specific status of an order
  getTimeForStatus(orderData: any, status: string) {
    const currentStatus = orderData.timing;
    const timeArray = currentStatus
      ?.filter((t: { status: string }) => t.status === status)
      .map((t) => t.time);
    return timeArray[0];
  }

  //  open creat ticket Modal
  openCreatTicketModal(data: any, orderView: any) {
    this.Submitted = false;
    this.creatTicketForm.reset();
    this.modalService.open(data, {
      centered: true,
      scrollable: true,
      size: "md",
    });
    this.orderDetails = orderView;
  }

  timelineData(time: any, curentStatus: any) {
    let map = new Map(
      time.map((timeData: any) => [timeData.status, timeData.time])
    );
   // console.log(map);

    return map.get(curentStatus);
    console.log(time);
  }

  creatTicketFormSubmit() {
    this.Submitted = true;
    if (this.creatTicketForm.invalid) {
      return;
    } else {
      const formData = {
        orderId: this.orderDetails.orderId,
        issue: this.creatTicketForm.value.issue,
        description: this.creatTicketForm.value.description,
      };
      this.outletService.creatTicket(formData).subscribe((res: any) => {
        if (res.status) {
          this.toastr.success(res.message, "Success!");
          this.modalService.dismissAll();
          this.creatTicketForm.reset();
        } else {
          this.toastr.error(res.message, "error!");
        }
      });
    }
  }
}
