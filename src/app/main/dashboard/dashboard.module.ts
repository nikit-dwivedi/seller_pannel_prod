import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { AuthGuard } from "app/services/auth.guard";
import { HomeComponent } from "./home/home.component";
import { OrdersComponent } from "./orders/orders.component";
import { AllOutletComponent } from "./outlet/all-outlet/all-outlet.component";
import { TicketComponent } from "./ticket/ticket.component";
import { Ng2FlatpickrModule } from "ng2-flatpickr";
import { PromotionComponent } from "./promotion/promotion.component";
import { OutletDetailsComponent } from "./outlet/outlet-details/outlet-details.component";
import { FileUploadModule } from "ng2-file-upload";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AddOutletComponent } from "./outlet/add-outlet/add-outlet.component";
import { OrderHistoryComponent } from "./outlet/order-history/order-history.component";
import { MenuComponent } from "./menu/menu.component";
import { NewmenuComponent } from "./newmenu/newmenu.component";

const routes: Routes = [
  {
    path: "",
    component: OrdersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "orders",
    component: OrdersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "allOutlet",
    component: AllOutletComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "promotion",
    component: PromotionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "ticket",
    component: TicketComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "outletDetails",
    component: OutletDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "addOutlet",
    component: AddOutletComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "orderHistory",
    component: OrderHistoryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "menu",
    component: MenuComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "newmenu",
    component: NewmenuComponent,
  },
];

@NgModule({
  declarations: [
    HomeComponent,
    OrdersComponent,
    AllOutletComponent,
    TicketComponent,
    PromotionComponent,
    OutletDetailsComponent,
    AddOutletComponent,
    OrderHistoryComponent,
    MenuComponent,
    NewmenuComponent,
  ],
  imports: [
    FileUploadModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    Ng2FlatpickrModule,
    NgxDatatableModule,
    RouterModule.forChild(routes),
  ],
})
export class DashboardModule {}
