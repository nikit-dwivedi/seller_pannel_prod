import { Component, OnInit,ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {

  private tempData = []; 
  public kitchenSinkRows: any;
  public basicSelectedOption: number = 10;
  public ColumnMode = ColumnMode;
  public expanded = {};
  public chkBoxSelected = [];
  public SelectionType = SelectionType;
  private exportCSVData: [] | any;

  @ViewChild(DatatableComponent) table: DatatableComponent | any;
  @ViewChild('tableRowDetails') tableRowDetails: any;
  cols = [{ name: 'issue' }, { name: 'role' }, { name: 'priority' }, { name: 'status' }];
  rows: any;
  data = [];
  filteredData = [];
  formula: string = 'All Tickets';
  isShow:Boolean=false;
  status= 'All'
  allTicket:any;
  viewById:any;
  ticketDetails:any;
  ticketList:any;
  constructor(private AuthService:AuthService,private modalService: NgbModal){}

  public contentHeader: object

  ngOnInit(): void {
    this.allTicketList();
    this.contentHeader = {
      headerTitle: 'Ticket',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Ticket',
            isLink: true,
            link: '/dashboard/ticket'
          }
        ]
      }
    }
  }

 selcectStatus(event:any){
    this.status = event.target.value;
    this.allTicketList();
  }

  viewDetails(ticket:any){
    // this.viewById = ticket
    // this.isShow = true;
    this.AuthService.ViewTicketDetails(this.viewById).subscribe((data:any)=>{
      this.ticketDetails = data.items;
    });
   }
  
   closeDetails(){
    this.isShow= false;
   }

  // get all ticket
  allTicketList(){
    this.AuthService.getAllTicket(this.status).subscribe((data:any) => {
      this.allTicket = data.items;
      this.ticketList  = this.allTicket
    });
  }

  filterUpdate(event: any) {
    const val = event.target.value.toLowerCase();
    const temp = this.ticketList.filter(function (d) {
      return d.issue?.toLowerCase().indexOf(val) !== -1 || d.ticketId?.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.allTicket = temp;
  }

  onSelect({ selected }: any) {
    this.exportCSVData = selected;
  }

  downloadCSV(event: any) {
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: '',
      useBom: true,
      noDownload: false,
      headers: ['Ticket Id', 'User Id', 'Order Id' ,'Role','Issue' , 'Description', 'Priority' , 'Status' ,'Assigned To'],
    }

    if (this.exportCSVData == undefined) {
      const fileInfo = new ngxCsv(this.ticketList, this.formula, options);

    } else {
      const fileInfo = new ngxCsv(this.exportCSVData, this.formula, options);
      this.exportCSVData = undefined;
    }

  }
  onActivate(event: any) {
    // console.log('Activate Event', event.type);
  }

    // open view product details Modal
    modalProductView(data: any, ticketId: any) {
      this.AuthService.ViewTicketDetails(ticketId).subscribe((data:any)=>{
        this.ticketDetails = data.items;
        this.ticketDetails.productNameList =  data.items?.orderDetails?.productList.reduce(
          (accumulator, currentValue) => accumulator==""?currentValue.productName:accumulator +","+ currentValue.productName,
          ""
        );
      });
      this.modalService.open(data, {
        windowClass: 'modal right'
      });
     
      // this.product = viewDetails;
    }


}
