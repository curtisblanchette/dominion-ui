import { AfterViewInit, Component, ElementRef, EventEmitter, Output, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromFlow from '../../store/flow.reducer';
import { FlowStep } from '../../classes';
import { animationFrameScheduler, auditTime, fromEvent, Observable, of, skip, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FlowService } from '../../flow.service';
import { FlowStatus } from '../../store/flow.reducer';

@UntilDestroy()
@Component({
  selector: 'flow-timeline',
  templateUrl: './flow-timeline.component.html',
  styleUrls: ['./flow-timeline.component.scss']
})
export class FlowTimelineComponent implements AfterViewInit {

  public steps$: Observable<FlowStep[]>;
  public currentStepId$: Observable<string | undefined>;
  public status$: Observable<FlowStatus>;
  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('content') content: ElementRef;
  @ViewChild('scroller') scroller: ElementRef;
  @ViewChild('viewport') viewport: ElementRef;

  @ViewChildren('item') items: QueryList<ElementRef>;
  constructor(
    private store: Store<fromFlow.FlowState>,
    public renderer: Renderer2,
    public flowService: FlowService
  ) {

    this.status$ = this.store.select(fromFlow.selectFlowStatus);
    // find steps, stop at current
    this.store.select(fromFlow.selectCurrentStepId).pipe(
      distinctUntilChanged()
    ).subscribe(currentStepId => {

      if(currentStepId) {
        setTimeout(() => {
          this.scrollActiveIntoView();
        }, 50);

        this.currentStepId$ = of(currentStepId);
      }

    });
    this.steps$ = this.store.pipe(select(fromFlow.selectTimeline), distinctUntilChanged());
  }

  public ngAfterViewInit() {
    fromEvent(window, 'resize').pipe(
      untilDestroyed(this),
      auditTime(10, animationFrameScheduler),
      tap(() => this.scrollActiveIntoView())
    ).subscribe();


    fromEvent(this.scroller.nativeElement, 'wheel').pipe(
      untilDestroyed(this),
      skip(1), // skip the initial scroll event emitted by the browser
      tap((event: any) => {
        const itemHeight = this.viewport.nativeElement.offsetHeight;
        const totalHeight = this.viewport.nativeElement.offsetHeight * this.items.length;
        // update the scroll position right away
        const withinUpperBound = event.currentTarget.scrollTop < totalHeight;
        const withinLowerBound = event.currentTarget.scrollTop > itemHeight;
        const outsideUpperBound = event.currentTarget.scrollTop > totalHeight;
        const outsideLowerBound = event.currentTarget.scrollTop < itemHeight;

        if(withinUpperBound && withinLowerBound) {
          this.renderer.setStyle(this.content.nativeElement, 'top', -this.scroller.nativeElement.scrollTop + 'px');
        }

        if(outsideLowerBound) {
          event.currentTarget.scrollTop = itemHeight;
          this.renderer.setStyle(this.content.nativeElement, 'top', itemHeight);
        }

        if(outsideUpperBound) {
          event.currentTarget.scrollTop = this.viewport.nativeElement.offsetHeight * this.items.length;
          this.renderer.setStyle(this.content.nativeElement, 'top', -this.viewport.nativeElement.offsetHeight * this.items.length);
        }




      }),
      debounceTime(50),
      distinctUntilChanged()
    ).subscribe((e: any) => {
      // TODO detect if this was a navigation or actual mouse wheel event
      // debounce element updates to reduce memory consumption for many mousewheel events
      this.items.forEach(item => this.isElementInViewport(item));
      const active = this.items.find(el => el.nativeElement.classList.contains('active'));
      this.onSelect.next(active?.nativeElement.id);
    });

  }

  scrollActiveIntoView() {
    // get active element position
    // scroll the element into view
    const active = this.items.find(el => el.nativeElement.classList.contains('active'));
    this.scroller.nativeElement.scrollTop = active?.nativeElement.offsetTop + active?.nativeElement.offsetHeight;
    this.renderer.setStyle(this.content.nativeElement, 'top', - (active?.nativeElement.offsetTop + active?.nativeElement.offsetHeight) + 'px');
  }

  onClick(id: string) {
    this.onSelect.next(id);
  }

  isElementInViewport(el: ElementRef) {
    const rect = el.nativeElement.getBoundingClientRect();
    const vwTop = this.viewport.nativeElement.offsetTop;
    const vwLeft = this.viewport.nativeElement.offsetLeft;
    const vwRight = this.viewport.nativeElement.offsetLeft + this.viewport.nativeElement.offsetWidth;
    const vwBottom = this.viewport.nativeElement.offsetTop + this.viewport.nativeElement.offsetHeight
    if(
      rect.bottom >= vwTop
      && rect.right >= vwRight
      && rect.top <= vwTop
      && rect.bottom <= vwBottom
      && rect.left <= vwLeft
    ) {
      el.nativeElement.classList.add('active');
    } else {
      el.nativeElement.classList.remove('active');
    }


    // block scroll past the last element
    if(this.scroller.nativeElement.scrollTop >= this.viewport.nativeElement.offsetHeight * this.items.length){
      this.scroller.nativeElement.scrollTop = this.viewport.nativeElement.offsetHeight * this.items.length;
    }

  }



  disableScroll() {
    const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
    window.addEventListener(wheelEvent, this.preventDefault,  { passive: false }); // modern desktop
  }

  preventDefault(e: Event) {
    e.preventDefault();
  }


}
