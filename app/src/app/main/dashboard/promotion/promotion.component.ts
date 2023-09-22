import { Component, OnInit } from "@angular/core";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  NgForm,
  ValidationErrors,
  ValidatorFn,
} from "@angular/forms";
import { OutletServiceService } from "app/services/outlet-service.service";
import { ToastrserviceService } from "app/services/toastrservice.service";
import { log } from "console";

@Component({
  selector: "app-promotion",
  templateUrl: "./promotion.component.html",
  styleUrls: ["./promotion.component.scss"],
})
export class PromotionComponent implements OnInit {
  promotionList: any;
  discountId: any;
  editDiscountForm: FormGroup;
  addDiscountForm: FormGroup;
  submitted: Boolean = false;
  isFlat: Boolean = false;
  offerDetail: any;

  constructor(
    private toastr: ToastrserviceService,
    private fb: FormBuilder,
    private outletService: OutletServiceService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getAllPromotion();
    // add discount form
    this.addDiscountForm = this.fb.group({
      discountTitle: new FormControl("", [Validators.required]),
      discountPercent: new FormControl("", [Validators.required]),
      maxDiscount: new FormControl("", [Validators.required]),
      minAmount: new FormControl("", [Validators.required]),
      isFlatDiscount: new FormControl("", [Validators.required]),
    });
  }
  
  flatDiscountProperty(data: any) {
    console.log(data.target.checked);
  }

  get addDiscount() {
    return this.addDiscountForm.controls;
  }

  

  addDiscountFormSubmit() {
    this.submitted = true;
    if (this.isFlat) {
    
      this.addDiscount.maxDiscount.setValue(0);
    }
    if (this.addDiscountForm.invalid) {
      console.log("this.addDiscountForm.invalid", this.addDiscountForm);
      return;
    } else {
      const formData = {
        discountTitle: this.addDiscountForm.value.discountTitle,
        promoCode: this.addDiscountForm.value.promoCode,
        discountPercent: this.addDiscountForm.value.discountPercent,
        maxDiscount: this.addDiscountForm.value.maxDiscount,
        minAmount: this.addDiscountForm.value.minAmount,
        isFlatDiscount: this.addDiscountForm.value.isFlatDiscount,
      };
      this.outletService.addNewDiscount(formData).subscribe((res: any) => {
        if (res.status) {
          this.toastr.showSuccess(res.message, "Success!");
          this.getAllPromotion();
          this.addDiscountForm.reset();
          this.modalService.dismissAll();
        } else {
          this.toastr.showError(res.message, "error!");
          this.getAllPromotion();
        }
      });
    }
  }
  // get all promotion
  getAllPromotion() {
    this.outletService.getAllOffer().subscribe((data: any) => {
      this.promotionList = data.items;
    });
  }

  flatValue(event: any) {
    this.isFlat = event.target.checked;
    console.log("this.isFlat", this.isFlat ? [] : [Validators.required]);
  }
  // modal add offers
  openAddPromotionModal(data: any) {
    this.modalService.open(data, {
      centered: true,
    });
  }

  // modal edit offers
  openEditOfferModal(data: any, discount: any) {
    this.modalService.open(data, {
      centered: true,
      size: "md",
    });
    this.discountId = discount.discountId;

    this.isFlat = discount.isFlatDiscount;
    this.addDiscountForm.patchValue({
      discountTitle: discount.discountTitle,
      isFlatDiscount: discount.isFlatDiscount,

      discountPercent: discount.discountPercent,
      maxDiscount: discount.maxDiscount,
      minAmount: discount.minAmount,
    });
  }

 /*  editDiscountFormSubmit() {
    this.submitted = true;
    if (this.isFlat) {
      console.log("==============______");
      this.addDiscount.maxDiscount.setValue(0);
    }
    if (this.addDiscountForm.invalid) {
      return;
    } else {
      const formData = {
        discountTitle: this.editDiscountForm.value.discountTitle,
        promoCode: this.editDiscountForm.value.promoCode,
        discountPercent: this.editDiscountForm.value.discountPercent,
        maxDiscount: this.editDiscountForm.value.maxDiscount,
        minAmount: this.editDiscountForm.value.minAmount,
      };
    }
  } */

  modalOfferDelete(modalData: any, Offer: any) {
    this.offerDetail = Offer;
    this.modalService.open(modalData, {
      centered: true,
      size: "md",
    });
  }

  deletePromotion() {
    this.outletService
      .deletData({ discountId: this.offerDetail.discountId })
      .subscribe((res: any) => {
        if (!res.status) {
          this.toastr.showError(res.message, "Error");
          this.modalService.dismissAll();
        }
        this.toastr.showSuccess(res.message, "Succes");
        this.getAllPromotion();
        this.modalService.dismissAll();
      });
  }
}
