import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/services/login.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private loginservice:LoginService,
    private http:HttpClient
  ) { }

  ngOnInit(): void {
    
  }

  public logout(){
    this.loginservice.logout();
  }

}
