import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ModuleTypes } from '../../../data/entity-metadata';
import { Fields } from '../../../common/models/event.model';
import { FiizListComponent } from '../../../common/components/ui/list/list.component';
import { Router } from '@angular/router';

@Component({
  selector: 'no-outcome-list',
  templateUrl: './no-outcome-list.component.html',
  styleUrls: ['../../../../assets/css/_container.scss', './no-outcome-list.component.scss']
})
export class NoOutcomeListComponent implements AfterViewInit {
  public ModuleTypes: any;
  public fields: any = Fields;

  @ViewChild(FiizListComponent) cmp: FiizListComponent;

  constructor(
    private router: Router
  ) {
    this.ModuleTypes = ModuleTypes;

  }

  ngAfterViewInit() {
    this.cmp.values.subscribe((action: any) => {
      this.router.navigate([`/no-outcome/${action.record.id}`]);
    });
  }
}
