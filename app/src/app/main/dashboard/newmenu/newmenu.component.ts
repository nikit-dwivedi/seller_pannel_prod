import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { OutletServiceService } from "app/services/outlet-service.service";
import { ToastrserviceService } from "app/services/toastrservice.service";

@Component({
  selector: "app-newmenu",
  templateUrl: "./newmenu.component.html",
  styleUrls: ["./newmenu.component.scss"],
})
export class NewmenuComponent implements OnInit {
  getAllCategorysName: any;
  subCategoryName: any;
  CategoryForm: FormGroup;
  submitted: boolean;
  isCategoryEditForm: Boolean = false;
  editCategoryData: any;
  modalRef: import("@ng-bootstrap/ng-bootstrap").NgbModalRef;
  categoryId: any;
  constructor(
    private modalService: NgbModal,
    private toastr: ToastrserviceService,
    private outletService: OutletServiceService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getAllCategory();
    this.CategoryForm = this.fb.group({
      categoryName: new FormControl("", [Validators.required]),
    });
  }

  // GET ALL Category
  getAllCategory() {
    this.outletService.getAllCategory("27bc367debc9").subscribe((data: any) => {
      this.getAllCategorysName = data.items;
    });
  }

  get category() {
    return this.CategoryForm.controls;
  }

  openAddCategoryModal(data: any) {
    this.isCategoryEditForm = false;
    this.submitted = false;
    this.modalService.open(data, {
      centered: true,
      scrollable: true,
      size: "md",
    });
  }

  addCategoryFormSubmit() {
    this.submitted = true;
    if (this.CategoryForm.invalid) {
      return;
    } else {
      if (this.isCategoryEditForm) {
        // handle edit for subbmit
        const formData = {
          categoryId: this.editCategoryData.categoryId,
          categoryName: this.CategoryForm.value.categoryName,
        };
        this.outletService.editCategory(formData).subscribe((res: any) => {
          if (res.status) {
            this.toastr.showSuccess(res.message, "Success!");
            this.getAllCategory();
            this.modalService.dismissAll();
            this.CategoryForm.reset();
          } else {
            this.toastr.showError(res.message, "error!");
            this.getAllCategory();
          }
        });
        return;
      }
    }
    // handle add for subbmit
    const formData = {
      outletId: "27bc367debc9",
      categoryName: this.CategoryForm.value.categoryName,
    };
    this.outletService.addCategory(formData).subscribe((data: any) => {
      if (data.status) {
        this.toastr.showSuccess(data.message, "Success!");
        this.modalService.dismissAll();
        this.CategoryForm.reset();
        this.submitted = false;
        this.getAllCategory();
      } else {
        this.toastr.showError(data.message, "error!");
      }
    });
  }

  openEditCategoryModal(data: any, editCategory: any) {
    this.editCategoryData = editCategory;
    this.isCategoryEditForm = true;
    this.modalService.open(data, {
      centered: true,
      scrollable: true,
      size: "md",
    });

    this.CategoryForm.patchValue({
      categoryName: editCategory.categoryName,
    });
  }

  opendeleteModal(data: any, deleteId: any) {
    this.modalRef = this.modalService.open(data, {
      centered: true,
      scrollable: true,
      size: "md",
    });
    this.categoryId = deleteId.categoryId;
  }

  Delete() {
   this.outletService
      .deletData({ categoryId: this.categoryId })
      .subscribe((res: any) => {
        if (res.status) {
          this.toastr.showSuccess(res.message, "Success!");
          this.getAllCategory();
          this.modalService.dismissAll();
          this.CategoryForm.reset();
        } else {
          this.toastr.showError(res.message, "error!");
          this.getAllCategory();
        }
      });
  }
  // GET Subcategory
  getSubcategory(categoryData: any) {
    this.outletService
      .getSubCategory(categoryData.categoryId)
      .subscribe((data: any) => {
        this.subCategoryName = data.items;
      });
  }
}
