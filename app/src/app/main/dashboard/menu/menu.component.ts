import { Component, OnInit, ViewChild } from "@angular/core";
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from "@swimlane/ngx-datatable";
import { ngxCsv } from "ngx-csv/ngx-csv";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from "@angular/forms";
import { Router, Navigation } from "@angular/router";
import { OutletServiceService } from "app/services/outlet-service.service";
import { ToastrserviceService } from "app/services/toastrservice.service";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
})
export class MenuComponent implements OnInit {
  private tempData = [];
  private tempData1 = [];
  private tempData2 = [];
  public kitchenSinkRows: any;
  public kitchenSinkRows1: any;
  public kitchenSinkRows2: any;
  public basicSelectedOption: number = 10;
  public ColumnMode = ColumnMode;
  public expanded = {};
  public chkBoxSelected = [];
  public SelectionType = SelectionType;
  private exportCSVData: [] | any;

  @ViewChild(DatatableComponent) table: DatatableComponent | any;
  @ViewChild("tableRowDetails") tableRowDetails: any;
  cols = [
    { name: "name" },
    { name: "minSelection" },
    { name: "maxSelection" },
    { name: "Actions" },
  ];
  cols1 = [
    { name: "name" },
    { name: "minSelection" },
    { name: "maxSelection" },
    { name: "Actions" },
  ];
  cols2 = [
    { name: "name" },
    { name: "minSelection" },
    { name: "maxSelection" },
    { name: "Actions" },
  ];
  modalRef: NgbModalRef;
  addCategoryForm: FormGroup;
  addProductForm: FormGroup;
  editCategoryForm: FormGroup;
  addVariationForm: FormGroup;
  editVariationForm: FormGroup;
  editVariantForm: FormGroup;
  addVariantForm: FormGroup;
  editProductForm: FormGroup;
  addAddonCategoryForm: FormGroup;
  editAddonCategoryForm: FormGroup;
  addAddonProductForm: FormGroup;
  editAddonProductForm: FormGroup;
  Submitted: Boolean = false;
  submitted: Boolean = false;
  sUbmitted: Boolean = false;
  submitting: Boolean = false;
  rows: any;
  rows1: any;
  rows2: any;
  data = [];
  data1 = [];
  data2 = [];
  filteredData = [];
  filteredData1 = [];
  filteredData2 = [];
  formula: string = "CustomizationList";
  outletData: any;
  categoryList: any;
  subCategoryList: any;
  hasSubCat: any;
  subCategoryByID: any;
  productList: any;
  categoryData: any;
  isVeg: any;
  selectedImage: any;
  showSubcat: Boolean = false;
  showProduct: Boolean = false;
  product: any;
  productbyId: any;
  customizationById: any;
  customizationList: any;
  coustimized: any;
  editVariation: any;
  viewVariationList: any;
  editVariantById: any;
  editCategoryById: any;
  editproductById: any;
  newImage: any;
  previousImage: any;
  outletAddonList: any;
  addonByProduct: any;
  productAddonList: any;
  addonCategoryId: any;
  viewaddonById: any;
  productofProduct: any;
  linkProduct: any;
  unLinkProduct: any;
  editproductofAddon: any;
  hasProcheck: any;
  isAvailable: any;
  stock: any;
  Variant: any;
  variation: any;
  hasCustomization: Boolean;
  constructor(
    private modalService: NgbModal,
    private toastr: ToastrserviceService,
    private outletService: OutletServiceService,
    private fb: FormBuilder,
    private router: Router
  ) {
    let nav: Navigation = this.router.getCurrentNavigation();
    if (nav.extras && nav.extras.state && nav.extras.state.outletData) {
      this.outletData = nav.extras.state.outletData;
    } else {
      this.router.navigate(["/dashboard/allOutlet"]);
    }
  }

  ngOnInit(): void {
    this.allCategory();

    // add category form
    this.addCategoryForm = this.fb.group({
      categoryName: new FormControl("", [Validators.required]),
    });

    // edit category/subcategory form
    this.editCategoryForm = this.fb.group({
      categoryName: new FormControl("", [Validators.required]),
    });

    // add product form
    this.addProductForm = this.fb.group({
      productName: new FormControl("", [Validators.required]),
      productPrice: new FormControl("", [Validators.required]),
      isVeg: new FormControl("", [Validators.required]),
      productImage: new FormControl("", [Validators.required]),
    });

    // edit product form
    this.editProductForm = this.fb.group({
      productName: new FormControl("", [Validators.required]),
      productImage: new FormControl(""),
      productPrice: new FormControl("", [Validators.required]),
      isVeg: new FormControl("", [Validators.required]),
    });

    // add variation form
    this.addVariationForm = this.fb.group({
      variationName: new FormControl("", [Validators.required]),
    });

    // edit varation form
    this.editVariationForm = this.fb.group({
      variationName: new FormControl("", [Validators.required]),
      minSelection: new FormControl("", [Validators.required]),
      maxSelection: new FormControl("", [Validators.required]),
    });

    // edit variant form
    this.editVariantForm = this.fb.group({
      variantName: new FormControl("", [Validators.required]),
      variantPrice: new FormControl("", [Validators.required]),
    });

    // add variant form
    this.addVariantForm = this.fb.group({
      variantName: new FormControl("", [Validators.required]),
      variantPrice: new FormControl("", [Validators.required]),
    });

    // add addon category form
    this.addAddonCategoryForm = this.fb.group({
      categoryName: new FormControl("", [Validators.required]),
      minSelection: new FormControl("", [Validators.required]),
      maxSelection: new FormControl("", [Validators.required]),
    });

    // edit addon cateory form
    this.editAddonCategoryForm = this.fb.group({
      categoryName: new FormControl("", [Validators.required]),
      minSelection: new FormControl("", [Validators.required]),
      maxSelection: new FormControl("", [Validators.required]),
    });

    // add addon product form
    this.addAddonProductForm = this.fb.group({
      productName: new FormControl("", [Validators.required]),
      productPrice: new FormControl("", [Validators.required]),
    });

    // edit addon product form
    this.editAddonProductForm = this.fb.group({
      productName: new FormControl("", [Validators.required]),
      productPrice: new FormControl("", [Validators.required]),
    });
  }

  get c() {
    return this.addCategoryForm.controls;
  }

  get eCategory() {
    return this.editCategoryForm.controls;
  }

  get p() {
    return this.addProductForm.controls;
  }

  get ep() {
    return this.editProductForm.controls;
  }
  get v() {
    return this.addVariationForm.controls;
  }

  get editvariation() {
    return this.editVariationForm.controls;
  }

  get eVariant() {
    return this.editVariantForm.controls;
  }
  get adVariant() {
    return this.addVariantForm.controls;
  }

  get aaddon() {
    return this.addAddonCategoryForm.controls;
  }

  get eAddon() {
    return this.editAddonCategoryForm.controls;
  }

  get addonProduct() {
    return this.addAddonProductForm.controls;
  }

  get editproduct() {
    return this.editAddonProductForm.controls;
  }
  // get category
  allCategory() {
    this.outletService
      .getAllCategory(this.outletData.outletId)
      .subscribe((data: any) => {
        this.categoryList = data.items;
      });
  }

  openAddCategoryModal(data: any, isCategory: Boolean) {
    if (isCategory) {
      this.categoryData = undefined;
    }
    this.submitted = false;
    this.addCategoryForm.reset();
    this.modalService.open(data, {
      centered: true,
      scrollable: true,
      size: "md",
    });
  }

  openEditCategoryModal(data: any, editCategory: any) {
    this.modalService.open(data, {
      centered: true,
      scrollable: true,
      size: "lg",
    });
    this.editCategoryById = editCategory;

    this.editCategoryForm.patchValue({
      categoryName: editCategory.categoryName,
    });
  }

  editCategoryFormSubmit() {
    this.submitted = true;
    if (this.editCategoryForm.invalid) {
      return;
    } else {
      const formData = {
        categoryId: this.editCategoryById.categoryId,
        categoryName: this.editCategoryForm.value.categoryName,
      };
      this.outletService.editCategory(formData).subscribe((res: any) => {
        if (res.status) {
          this.toastr.showSuccess(res.message, "Success!");
          this.allCategory();
          this.getSubcategory();
          this.modalService.dismissAll();
          this.editCategoryForm.reset();
          if (this.hasSubCat) {
            this.showProduct = false;
          }

          if (!this.hasSubCat) {
            this.showSubcat = false;
          }
        } else {
          this.toastr.showError(res.message, "error!");
          this.allCategory();
          this.getSubcategory();
        }
      });
    }
  }
  openAddProductModal(data: any) {
    this.Submitted = false;
    this.addProductForm.reset();
    this.modalService.open(data, {
      centered: true,
      scrollable: true,
      size: "lg",
    });
  }

  openEditProductModal(data: any, editProduct: any) {
    this.modalService.open(data, {
      centered: true,
      scrollable: true,
      size: "lg",
    });
    this.editproductById = editProduct;
    this.editProductForm.patchValue({
      productName: editProduct.productName,
      productPrice: editProduct.productPrice,
      isVeg: editProduct.isVeg,
    });

    this.previousImage = editProduct.productImage;
  }

  chnageImage(event: any) {
    this.newImage = event.target.files[0];
  }
  editProductFormSubmit() {
    this.Submitted = true;
    if (this.editProductForm.invalid) {
      return;
    } else {
      const formData = new FormData();
      formData.append("productName", this.editProductForm.value.productName);
      formData.append("productPrice", this.editProductForm.value.productPrice);
      formData.append("isVeg", JSON.parse(this.editProductForm.value.isVeg));
      if (this.newImage == undefined) {
        formData.append("productImage", this.previousImage);
      } else {
        formData.append("productImage", this.newImage);
      }

      this.outletService
        .editProduct(this.editproductById.productId, formData)
        .subscribe((res: any) => {
          if (res.status) {
            this.toastr.showSuccess(res.message, "Success!");
            this.modalService.dismissAll();
            this.getProductByCategory(this.productbyId);
          } else {
            this.toastr.showError(res.message, "error!");
            this.getProductByCategory(this.productbyId);
          }
        });
    }
  }

  getMenu(category: any) {
    this.categoryData = category.categoryId;
    this.hasSubCat = category.hasSubCategory;
    this.hasProcheck = category.hasProduct;
    if (this.hasSubCat) {
      this.showProduct = false;
      this.getSubcategory();
    }

    if (!this.hasSubCat) {
      this.showSubcat = false;
      this.getProductByCategory(category);
    }

    if (!this.hasSubCat && !this.hasProcheck) {
      this.showProduct = true;
      this.showSubcat = true;
      this.getSubcategory();
      this.getProductByCategory(category);
    }
  }

  // get sub category
  getSubcategory() {
    this.showSubcat = true;
    this.outletService
      .getSubCategory(this.categoryData)
      .subscribe((data: any) => {
        this.subCategoryList = data.items;
      });
  }

  // get product
  getProductByCategory(subCategory: any) {
    this.productbyId = subCategory;
    this.showProduct = true;
    this.outletService
      .getProductById(this.productbyId.categoryId)
      .subscribe((data: any) => {
        this.productList = data.items;
      });
  }

  // add category/subcategory form submit
  addCategoryFormSubmit() {
    this.submitted = true;
    if (this.addCategoryForm.invalid) {
      return;
    } else {
      const formData = {
        outletId: this.outletData.outletId,
        categoryName: this.addCategoryForm.value.categoryName,
        parentCategoryId: this.categoryData ?? "",
      };
      this.outletService.addCategory(formData).subscribe((data: any) => {
        if (data.status) {
          this.toastr.showSuccess(data.message, "Success!");
          this.modalService.dismissAll();
          this.addCategoryForm.reset();
          this.allCategory();
          this.getSubcategory();
        } else {
          this.toastr.showError(data.message, "error!");
          this.allCategory();
          this.getSubcategory();
        }
      });
    }
  }

  //  get image for add product
  getImage(event: any) {
    this.selectedImage = event.target.files[0];
  }
  // add product form submit
  addProductFormSubmit() {
    this.Submitted = true;
    if (this.addProductForm.invalid) {
      return;
    } else {
      this.isVeg = JSON.parse(this.addProductForm.value.isVeg);

      const formData = new FormData();
      formData.append(
        "parentCategoryId",
        this.productbyId.categoryId ?? this.categoryData
      );
      formData.append("productName", this.addProductForm.value.productName);
      formData.append("productImage", this.selectedImage);
      formData.append("productPrice", this.addProductForm.value.productPrice);
      formData.append("isVeg", this.isVeg);

      this.outletService.addProduct(formData).subscribe((res: any) => {
        if (res.status) {
          this.toastr.showSuccess(res.message, "Success!");
          this.modalService.dismissAll();
          this.allCategory();
          this.getSubcategory();
          this.getProductByCategory(this.productbyId);
          this.addProductForm.reset();
          if (this.hasSubCat) {
            this.showProduct = false;
          }

          if (!this.hasSubCat) {
            this.showSubcat = false;
          }
        } else {
          this.toastr.showError(res.message, "error!");
        }
      });
    }
  }

  // open view product details Modal
  modalProductView(data: any, viewDetails: any) {
    this.modalService.open(data, {
      windowClass: "modal right",
    });
    this.product = viewDetails;
  }

  inStock(available: any) {
    this.isAvailable = available.inStock;
    if (this.isAvailable) {
      return true;
    } else {
      return false;
    }
  }

  changeStockStatus(stockChnage: any) {
    this.stock = stockChnage;

    this.outletService
      .chnageStockStatus(this.stock.productId)
      .subscribe((res: any) => {
        if (res.status) {
          this.toastr.showSuccess(res.message, "Success!");
          this.getProductByCategory(this.productbyId);
        } else {
          this.toastr.showError(res.message, "error!");
        }
      });
  }
  // open view product customization Modal
  openViewCustomizationModal(data: any, customByID: any) {
    this.modalRef = this.modalService.open(data, {
      size: "lg",
      windowClass: "modal top",
    });
    this.customizationById = customByID;
    this.hasCustomization = this.customizationById.hasCustomization;
    console.log("this.hasCustomization", this.hasCustomization);

    this.productCustomization();
  }

  // get product customization list
  productCustomization() {
    this.outletService
      .getCusomization(this.customizationById.productId)
      .subscribe((data: any) => {
        this.coustimized = [];
        this.customizationList = data.items;
        this.coustimized.push(this.customizationList);
        this.rows = this.coustimized;
        this.tempData = this.rows;
        this.kitchenSinkRows = this.rows;
        this.data = this.coustimized;
        console.log("this.coustimized", this.coustimized);
      });
  }

  // open delete customization variant Modal
  openDeleteVariantModal(data: any, Variant: any) {
    this.modalRef = this.modalService.open(data, {
      centered: true,
      scrollable: true,
      size: "md",
    });
    this.Variant = Variant;
  }

  deletVariant() {
    const formData = {
      variantId: this.Variant.variantId,
    };
    this.outletService.deletData(formData).subscribe((res: any) => {
      if (res.status) {
        this.toastr.showSuccess(res.message, "Variant Deleted");
        this.modalRef.close();
        this.productCustomization();
      } else {
        this.toastr.showError(res.message, "error!");
      }
    });
  }
  // open add customization Modal
  openAddCustomizationModal(data: any) {
    this.sUbmitted = false;
    this.addVariationForm.reset();
    this.modalRef = this.modalService.open(data, {
      centered: true,
      scrollable: true,
      size: "md",
    });
  }

  addVariationFormSubmit() {
    this.sUbmitted = true;
    if (this.addVariationForm.invalid) {
      return;
    } else {
      const formData = {
        productId: this.customizationById.productId,
        variationName: this.addVariationForm.value.variationName,
      };
      this.outletService.addVariatiom(formData).subscribe((res: any) => {
        if (res.status) {
          this.toastr.showSuccess(res.message, "Success!");
          this.modalRef.close();
          this.sUbmitted = false;
          this.hasCustomization = !this.hasCustomization;
          this.productCustomization();
          this.addVariationForm.reset();
        } else {
          this.toastr.showError(res.message, "error!");
          this.addVariationForm.reset();
          this.productCustomization();
        }
      });
    }
  }

  // open edit customization Modal
  openEditCustomizationModal(data: any, variation: any) {
    this.modalRef = this.modalService.open(data, {
      centered: true,
      scrollable: true,
      size: "md",
    });
    this.editVariationForm.patchValue({
      variationName: variation.variationName,
      minSelection: variation.minSelection,
      maxSelection: variation.maxSelection,
    });
    this.editVariation = variation;
  }

  editVariationFormSubmit() {
    this.sUbmitted = true;
    if (this.editVariationForm.invalid) {
      return;
    } else {
      const formData = {
        variationName: this.editVariationForm.value.variationName,
        minSelection: this.editVariationForm.value.minSelection,
        maxSelection: this.editVariationForm.value.maxSelection,
      };
      this.outletService
        .editVariation(this.editVariation.variationId, formData)
        .subscribe((res: any) => {
          if (res.status) {
            this.toastr.showSuccess(res.message, "Success!");
            this.modalRef.close();
            this.productCustomization();
            this.editVariationForm.reset();
          } else {
            this.toastr.showError(res.message, "error!");
            this.productCustomization();
          }
        });
    }
  }

  // open view variation Modal
  openViewVariationModal(data: any, variation: any) {
    this.modalService.open(data, {
      centered: true,
      scrollable: true,
      size: "lg",
    });

    this.viewVariationList = variation;
  }

  //  open edit variant Modal
  openEditVariantModal(data: any, editVariant: any) {
    this.modalRef = this.modalService.open(data, {
      centered: true,
      scrollable: true,
      size: "md",
    });
    this.editVariantById = editVariant;

    this.editVariantForm.patchValue({
      variantName: editVariant.variantName,
      variantPrice: editVariant.displayPrice,
    });
  }

  editVariantFormSubmit() {
    this.submitting = true;
    if (this.editVariantForm.invalid) {
      return;
    } else {
      const formData = {
        variantId: this.editVariantById.variantId,
        variantName: this.editVariantForm.value.variantName,
        variantPrice: this.editVariantForm.value.variantPrice,
      };

      this.outletService.editVariant(formData).subscribe((res: any) => {
        if (res.status) {
          this.toastr.showSuccess(res.message, "Success!");
          this.modalRef.close();
          this.productCustomization();
        } else {
          this.toastr.showError(res.message, "error!");
          this.productCustomization();
        }
      });
    }
  }

  // open add variant Modal
  openAddVariantModal(data: any, variation: any) {
    this.submitting = false;
    this.addVariantForm.reset();
    this.modalRef = this.modalService.open(data, {
      centered: true,
      scrollable: true,
      size: "md",
    });
    this.variation = variation;
  }

  addVariantFormSubmit() {
    this.submitting = true;
    if (!this.addVariantForm.valid) {
      return;
    } else {
      const formData = {
        variationId: this.variation.variationId,
        variantName: this.addVariantForm.value.variantName,
        variantPrice: this.addVariantForm.value.variantPrice,
      };

      this.outletService.addVariant(formData).subscribe((res: any) => {
        if (res.status) {
          this.toastr.showSuccess(res.message, "Success!");
          this.productCustomization();
          this.modalRef.close();
          this.submitting = false;
          this.addVariantForm.reset();
        } else {
          this.toastr.showError(res.message, "error!");
        }
      });
    }
  }

  // open view addon Modal
  openViewAddonModal(data: any, viewAddonByProduct: any) {
    this.modalService.open(data, {
      size: "lg",
      windowClass: "modal left",
    });
    this.addonByProduct = viewAddonByProduct;
    this.outletAddon();
    this.productAddon();
  }

  // get all addon of outlet

  outletAddon() {
    this.outletService
      .getOutletAddon(this.outletData.outletId)
      .subscribe((res: any) => {
        this.outletAddonList = res.items;
        this.rows2 = res.items;
        this.tempData2 = this.rows2;
        this.kitchenSinkRows2 = this.rows2;
        this.data2 = this.outletAddonList;
        this.filteredData2 = this.outletAddonList;
      });
  }

  // get all addon of product
  productAddon() {
    this.outletService
      .getProductAddon(this.addonByProduct.productId)
      .subscribe((res: any) => {
        this.productAddonList = res.items;
        this.rows1 = res.items;
        this.tempData1 = this.rows1;
        this.kitchenSinkRows1 = this.rows1;
        this.data1 = this.productAddonList;
        this.filteredData1 = this.productAddonList;
      });
  }

  // open add addon category Modal
  openaddAddonCategoryModal(data: any) {
    this.submitted = false;
    this.addAddonCategoryForm.reset();
    this.modalRef = this.modalService.open(data, {
      centered: true,
      scrollable: true,
      size: "lg",
    });
  }

  addAddonCategoryFormSubmit() {
    this.submitted = true;
    if (this.addAddonCategoryForm.invalid) {
      return;
    } else {
      const formData = {
        outletId: this.outletData.outletId,
        categoryName: this.addAddonCategoryForm.value.categoryName,
        minSelection: this.addAddonCategoryForm.value.minSelection,
        maxSelection: this.addAddonCategoryForm.value.maxSelection,
      };
      this.outletService.addAddonCategory(formData).subscribe((res: any) => {
        if (res.status) {
          this.toastr.showSuccess(res.message, "Success!");
          this.outletAddon();
          this.modalRef.close();
          this.submitted = false;
          this.addAddonCategoryForm.reset();
        } else {
          this.toastr.showError(res.message, "error!");
          this.outletAddon();
        }
      });
    }
  }

  // open edi addon category Modal
  openEditAddonCategoryModal(data: any, editAddon: any) {
    this.modalRef = this.modalService.open(data, {
      centered: true,
      scrollable: true,
      size: "lg",
    });
    this.addonCategoryId = editAddon;
    this.editAddonCategoryForm.patchValue({
      categoryName: editAddon.categoryName,
      minSelection: editAddon.minSelection,
      maxSelection: editAddon.maxSelection,
    });
  }

  editAddonCategoryFormSubmit() {
    this.submitted = true;
    if (this.editAddonCategoryForm.invalid) {
      return;
    } else {
      const formData = {
        addOnCategoryId: this.addonCategoryId.addOnCategoryId,
        categoryName: this.editAddonCategoryForm.value.categoryName,
        minSelection: this.editAddonCategoryForm.value.minSelection,
        maxSelection: this.editAddonCategoryForm.value.maxSelection,
      };
      this.outletService.editAddonCategory(formData).subscribe((res: any) => {
        if (res.status) {
          this.toastr.showSuccess(res.message, "Success!");
          this.modalRef.close();
          this.outletAddon();
        } else {
          this.toastr.showError(res.message, "error!");
          this.outletAddon();
        }
      });
    }
  }

  // view outlet addon product
  openViewAddonProductModal(data: any, ViewAddonProduct: any) {
    this.modalRef = this.modalService.open(data, {
      size: "lg",
      windowClass: "modal right",
    });
    this.viewaddonById = ViewAddonProduct;
  }

  // view product addon product
  openViewProductAddonProductModal(data: any, viewProductofProduct: any) {
    this.modalRef = this.modalService.open(data, {
      centered: true,
      scrollable: true,
      size: "lg",
    });
    this.productofProduct = viewProductofProduct.productList;
  }

  //open link outlet addon to product Modal
  linkToProduct(data: any, linkById: any) {
    this.modalRef = this.modalService.open(data, {
      centered: true,
      scrollable: true,
      size: "md",
    });
    this.linkProduct = linkById;
  }
  link() {
    const formData = {
      productId: this.product.productId,
      addOnCategoryId: this.linkProduct.addOnCategoryId,
      operation: true,
    };

    this.outletService.linkUnLink(formData).subscribe((res: any) => {
      if (res.status) {
        this.toastr.showSuccess(res.message, "Success!");
        this.productAddon();
        this.modalRef.close();
      } else {
        this.toastr.showError(res.message, "error!");
        this.productAddon();
      }
    });
  }

  // opne unlink addon form product Modal
  opneUnlinkModal(data: any, unlinkById: any) {
    this.modalRef = this.modalService.open(data, {
      centered: true,
      scrollable: true,
      size: "lg",
    });
    this.unLinkProduct = unlinkById;
  }
  unlink() {
    const formData = {
      productId: this.product.productId,
      addOnCategoryId: this.unLinkProduct.addOnCategoryId,
      operation: false,
    };
    this.outletService.linkUnLink(formData).subscribe((res: any) => {
      if (res.status) {
        this.toastr.showSuccess(res.message, "Success!");
        this.productAddon();
        this.modalRef.close();
      } else {
        this.toastr.showError(res.message, "error!");
        this.productAddon();
      }
    });
  }

  // open add addon product Modal
  openAddAdonProductModal(data: any) {
    this.submitting = false;
    this.addAddonProductForm.reset();
    this.modalRef = this.modalService.open(data, {
      centered: true,
      scrollable: true,
      size: "lg",
    });
  }

  addAddonProductFormSubmit() {
    this.submitting = true;
    if (this.addAddonProductForm.invalid) {
      return;
    } else {
      const formData = {
        addOnCategoryId: this.viewaddonById.addOnCategoryId,
        productName: this.addAddonProductForm.value.productName,
        productPrice: this.addAddonProductForm.value.productPrice,
      };
      this.outletService.addNewproduct(formData).subscribe((res: any) => {
        if (res.status) {
          this.toastr.showSuccess(res.message, "Success!");
          this.outletAddon();
          this.submitting = false;
          this.addAddonProductForm.reset();
          this.modalRef.close();
        } else {
          this.toastr.showError(res.message, "error");
          this.outletAddon();
        }
      });
    }
  }
  // open edit addon product Modal
  openEditAddonProductModal(data: any, editproduct: any) {
    this.modalRef = this.modalService.open(data, {
      centered: true,
      scrollable: true,
      size: "lg",
    });
    this.editproductofAddon = editproduct;
    this.editAddonProductForm.patchValue({
      productName: editproduct.productName,
      productPrice: editproduct.productPrice,
    });
  }

  editAddonProductFormSubmit() {
    this.submitting = true;
    if (this.editAddonProductForm.invalid) {
      return;
    } else {
      const formData = {
        addOnProductId: this.editproductofAddon.addOnProductId,
        productName: this.editAddonProductForm.value.productName,
        productPrice: this.editAddonProductForm.value.productPrice,
      };
      this.outletService.editaddonProduct(formData).subscribe((res: any) => {
        if (res.status) {
          this.toastr.showSuccess(res.message, "Success!");
          this.outletAddon();
          this.modalRef.close();
        } else {
          this.toastr.showError(res.message, "error!");
          this.outletAddon();
        }
      });
    }
  }

  filterUpdate(event: any) {
    let val = event.target.value.toLowerCase();
    let colsAmt = this.cols.length;
    let keys = Object.keys([0]);

    this.data = this.filteredData.filter(function (item: any): any {
      for (let i = 0; i < colsAmt; i++) {
        if (
          item[keys[i]]?.toString().toLowerCase().indexOf(val) !== -1 ||
          !val
        ) {
          return true;
        }
      }
    });
    this.kitchenSinkRows = this.data;
    this.table.offset = 0;
  }

  serachAddon(event: any) {
    const val = event.target.value.toLowerCase();
    // filter our data
    this.rows = this.outletAddonList.filter(function (d) {
      return d.categoryName?.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.kitchenSinkRows2 = this.rows;
  }

  serachProductAddon(event: any) {
    const val = event.target.value.toLowerCase();
    // filter our data
    this.rows = this.productAddonList.filter(function (d) {
      return d.categoryName?.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.kitchenSinkRows1 = this.rows;
  }

  onSelect({ selected }: any) {
    this.exportCSVData = selected;
  }

  downloadCSV(event: any) {
    var options = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalseparator: ".",
      showLabels: true,
      showTitle: true,
      title: "",
      useBom: true,
      noDownload: false,
      headers: [
        "variationId",
        "Variation Name",
        "Min Selection",
        "Max Selection",
      ],
    };

    if (this.exportCSVData == undefined) {
      const fileInfo = new ngxCsv(this.tempData, this.formula, options);
    } else {
      const fileInfo = new ngxCsv(this.exportCSVData, this.formula, options);

      this.exportCSVData = undefined;
    }
  }
  onActivate(event: any) {}
}
