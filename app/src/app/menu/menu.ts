import { CoreMenu } from "@core/types";

export const menu: CoreMenu[] = [
  {
    id: "home",
    title: "Home",
    translate: "MENU.HOME",
    type: "item",
    url: "dashboard/home",
  },
  {
    id: "orders",
    title: "Orders",
    translate: "MENU.ORDERS",
    type: "item",
    url: "dashboard/orders",
  },
  {
    id: "allOutlet",
    title: "All Outlet",
    translate: "MENU.ALLOUTLET",
    type: "item",
    url: "dashboard/allOutlet",
  },
  {
    id: "ticket",
    title: "Ticket",
    translate: "MENU.TICKET",
    type: "item",
    url: "dashboard/ticket",
  },
  {
    id: "promotion",
    title: "Promotion",
    translate: "MENU.PROMOTION",
    type: "item",
    url: "dashboard/promotion",
  },
  // {
  //   id: "newmenu",
  //   title: "newmenu",
  //   translate: "MENU.NEWMENU",
  //   type: "item",
  //   url: "dashboard/newmenu",
  // },
];
