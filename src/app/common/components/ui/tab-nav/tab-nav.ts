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

  public selected: string;
  @Input('items') items: IFiizTabNavItem[] | any[];
  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>()
  @ViewChild('activeUnderline', {static: false}) activeUnderline: ElementRef;
  @ViewChildren('link') links: QueryList<ElementRef>;

  constructor(
    private renderer: Renderer2
  ) {

  }

  ngAfterViewInit() {
    this.items = this.items.map((e) => ({...e, active: false}));
    this.selected = this.items[0];
    this.updateActiveUnderline();
  }

  updateActiveUnderline() {
      const el = this.links.find(item => item.nativeElement.classList.contains('active'))?.nativeElement;

      if (el) {
        const link = {
          left: el?.offsetLeft || 0,
          // width: el?.offsetWidth || 0
        }

        this.renderer.setStyle(this.activeUnderline.nativeElement, 'left', link.left + 'px');
        // this.renderer.setStyle(this.activeUnderline.nativeElement, 'width', link.width + 'px');
      }
  }

  public onClick($event: any) {
    this.updateActiveUnderline()
    this.selected = $event;
    this.onSelect.next(this.selected);
  }
}
