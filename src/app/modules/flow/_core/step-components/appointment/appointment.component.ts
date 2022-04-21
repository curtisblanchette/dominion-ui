import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EntityCollectionServiceFactory, EntityServices } from '@ngrx/data';

import { EntityCollectionComponentBase } from '../../../../../data/entity-collection.component.base';
import { FlowService } from '../../../flow.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['../_base.scss', './appointment.component.scss']
})
export class AppointmentComponent extends EntityCollectionComponentBase implements OnInit {

  constructor(
    private router: Router,
    private entityCollectionServiceFactory: EntityCollectionServiceFactory,
    public flowService: FlowService
  ) { 
    super(router, entityCollectionServiceFactory);
    this.data$.subscribe(data => {
      if(data.length > 1) {
        console.log(data);
      }
    })
  }

  ngOnInit(): void {
  }

}
