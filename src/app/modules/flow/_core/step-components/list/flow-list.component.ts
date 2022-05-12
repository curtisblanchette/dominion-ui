import { Component, OnDestroy } from '@angular/core';
import { FlowService } from '../../../flow.service';
import { Router } from '@angular/router';

@Component({
  selector: 'flow-list',
  templateUrl: './flow-list.component.html' ,
  styleUrls: ['../_base.scss','./flow-list.component.scss']
})
export class FlowListComponent implements OnDestroy {
  public state: any;

  constructor(
    router: Router,
    public flowService: FlowService
  ) {
    this.state = router.getCurrentNavigation()!.extras.state;
    console.log(this);
  }

  public ngOnDestroy(): void {

  }

  public EmitValues( value:any ){
    console.log('Emitted Values ', value);
  }

}
