import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['../../../assets/css/_container.scss', './page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  constructor( private location: Location ) { }

  ngOnInit(): void {
  }

  handle404Back() {
		this.location.back();
	}

}
