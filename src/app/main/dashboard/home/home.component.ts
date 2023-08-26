import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private AuthService: AuthService) { }
  public contentHeader: object
  AllData:any
  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Home',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: 'dashboard/home'
          }
        ]
      }
    }
this.allData()
  
  }
  
allData(){
  this.AuthService.allDataHomePage().subscribe((data:any)=>{
    if (!data.status) {
      this.AllData = [];
    }
    this.AllData = data.items;
  });
  
}

}
