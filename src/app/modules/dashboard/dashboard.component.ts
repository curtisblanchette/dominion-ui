import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/services/login.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private loginservice:LoginService
  ) { }

  ngOnInit(): void {
  }

  public logout(){
    this.loginservice.logout();
  }

}
