import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { CoreConfigService } from "@core/services/config.service";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "app/services/auth.service";
import { Console, log } from "console";

@Component({
  selector: "app-auth-login-v2",
  templateUrl: "./auth-login-v2.component.html",
  styleUrls: ["./auth-login-v2.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AuthLoginV2Component implements OnInit {
  //  Public
  public coreConfig: any;
  public loginForm: UntypedFormGroup;
  public otpVerifyForm: UntypedFormGroup;
  public loading = false;
  public submitted = false;
  public otpSubmitted = false;
  public returnUrl: string;
  public error = "";
  public passwordTextType: boolean;
  mobileForm: boolean = true;
  MobileNumber: any;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: UntypedFormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private toastr: ToastrService,
    private router: Router,
    private AuthService: AuthService
  ) {
    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true,
        },
        menu: {
          hidden: true,
        },
        footer: {
          hidden: true,
        },
        customizer: false,
        enableLocalStorage: false,
      },
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }
  get g() {
    return this.otpVerifyForm.controls;
  }
  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    } else {
      let body: any = {
        phone: JSON.parse(this.loginForm.value.number),
        userType: "seller",
      };

      localStorage.setItem("mobileNumber", this.loginForm.value.number);
      this.AuthService.loginWithMobileNumber(body).subscribe((res: any) => {
        if (res.status == true) {
          this.toastr.success(res.message);
          this.loginForm.reset();
          this.submitted = false;
          localStorage.setItem("reqId", res.items.reqId);
          this.mobileForm = false;
          this.MobileNumber = localStorage.getItem("mobileNumber");
          //this.router.navigate(['/auth/otpVerification'], { state: { reqId: res.items.reqId } })
          // this.router.navigate(['routetodetailscomponent'], { state: { data: order } });
          //this.router.navigate(['dashboard/blog-list'])
        } else {
          this.toastr.error(res.message);
          this.loginForm.reset();
        }
      });
    }
  }
  otpVerifySubmit() {
    this.submitted = true;
    this.MobileNumber = localStorage.getItem("mobileNumber");
    console.log(this.MobileNumber);

    if (this.otpVerifyForm.invalid) {
      return;
    } else {
      let body: any = {
        reqId: localStorage.getItem("reqId"),
        otp: this.otpVerifyForm.value.otp,
      };

      console.log(body);

      this.AuthService.otpValidate(body).subscribe((res: any) => {
        if (res.status == true) {
          this.otpVerifyForm.reset()
          if (!res.items.isOnboarded) {
            this.submitted = false;
            this.mobileForm = true;
            this.toastr.error("You are not onboarded");
            this.toastr.warning(
              "please contact our team to to proceed further with your application"
            );
            return;
          }
          this.toastr.success(res.message);
          this.submitted = false;
          this.router.navigate(["dashboard/orders"]);
          localStorage.setItem("sellerId", res.items.sellerId);
        } else {
          this.toastr.error(res.message);
        }
      });
    }
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  /*   ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      mobile: ['', [Validators.required]],
      
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';

    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  } */
  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      number: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
        ]),
      ],
    });

    this.otpVerifyForm = this._formBuilder.group({
      otp: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(4),
          Validators.minLength(4),
        ]),
      ],
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
