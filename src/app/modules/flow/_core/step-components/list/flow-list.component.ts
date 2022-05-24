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
    private router: Router,
    public flowService: FlowService
  ) {
    this.state = router.getCurrentNavigation()!.extras.state;
    console.log('this.state',this.state);
  }

  public ngOnDestroy(): void {
    console.log('Flow List component destroy');
  }

  public EmitValues( value:any ){
    if( value ){
      this.flowService.addVariables( {existing_lead : 'yes', existing_lead_record : value} );
    }
  }

}
