import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FlowService } from "./flow.service";
import { FlowTransitions } from "./_core";
import { TimelineComponent } from './_core/layout-components';

@Component({
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.scss'],
  animations: FlowTransitions
})
export class FlowComponent implements OnInit, OnDestroy {

  animationIndex = 0;
  tabIndex = 1;
  @ViewChild(FlowComponent) flow: FlowComponent;
  @ViewChild(TimelineComponent) timeline: TimelineComponent;


  constructor(
    private flowService: FlowService,
  ) {
  }

  public async ngOnInit() {
    await this.flowService.start();
  }

  public onActivate($event: any) {

  }

  public onNext(): Promise<any> {
    this.animationIndex++;
    return this.flowService.next();
  }

  public onBack(): Promise<any> {
    this.animationIndex--;
    return this.flowService.back();
  }

  public goTo(id: string): Promise<any> {
    const next = this.flowService.steps.findIndex(x => x.id === id);
    const current = this.flowService.steps.findIndex(x => x.id === this.flowService._currentStep.id);
    next < current ? this.animationIndex-- : this.animationIndex++;
    return this.flowService.goTo(id);
  }

  public ngOnDestroy() {

  }

}
