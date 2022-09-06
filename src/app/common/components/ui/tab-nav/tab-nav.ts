import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';

export interface IFiizTabNavItem {
  key: string;
  label: string;
  active?: boolean;
}

@Component({
  selector: 'fiiz-tab-nav',
  templateUrl: './tab-nav.html',
  styleUrls: ['./tab-nav.scss']
})
export class FiizTabNavComponent implements AfterViewInit {

  public selected: IFiizTabNavItem;
  @Input('items') items: IFiizTabNavItem[] | any[];
  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>()
  @ViewChild('activeUnderline', {static: false}) activeUnderline: ElementRef;
  @ViewChildren('link') links: QueryList<ElementRef>;

  constructor(
    private renderer: Renderer2
  ) {

  }

  ngAfterViewInit() {
    this.items = this.items.map((e, index) => ({...e, active: index < 1}));

    this.renderer.setStyle(this.activeUnderline.nativeElement, 'width', `${100 / this.items.length}%`);
    this.selected = this.items[0];
    this.updateActiveUnderline();
  }
  //
  // updateActiveUnderline() {
  //   setTimeout(() => {
  //     const el = this.links.find((item: any) => item.nativeElement.classList.contains('active'))?.nativeElement;
  //
  //     if (el) {
  //       const link = {
  //         left: el?.offsetLeft || 0
  //       }
  //       this.renderer.setStyle(this.activeUnderline.nativeElement, 'left', link.left + 'px');
  //     }
  //   })
  //
  // }

  updateActiveUnderline() {
    setTimeout(() => {
      const el = this.links.find(item => item.nativeElement.classList.contains('active'))?.nativeElement;

      if (el) {
        const link = {
          left: el?.offsetLeft || 0,
          width: el?.offsetWidth || 0
        }

        this.renderer.setStyle(this.activeUnderline.nativeElement, 'left', link.left + 'px');
        this.renderer.setStyle(this.activeUnderline.nativeElement, 'width', link.width + 'px');
      }
    });
  }


  public onClick($event: any) {
    this.items = this.items.map((e) => {
      return { ...e, active: e.key === $event.key };
    });
    this.selected = $event;
    this.onSelect.next(this.selected.key);
    this.updateActiveUnderline()
  }
}
