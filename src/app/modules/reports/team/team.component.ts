import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromReports from '../store/reports.reducer';
import * as reportsActions from '../store/reports.actions';
import { ViewStatus } from '../store/reports.reducer';
import { UntilDestroy } from '@ngneat/until-destroy';
import dayjs from 'dayjs';

import { FiizDatePickerComponent } from '../../../common/components/ui/forms';

export interface IStatCard { label: string | undefined; value: number, order: number }

@UntilDestroy()
@Component({
  selector: 'team-report',
  templateUrl: './team.component.html',
  styleUrls: ['../../../../assets/css/_container.scss','./team.component.scss']
})
export class TeamReportComponent implements OnInit, AfterViewInit {

  public today: any = dayjs().format();
  public status$: Observable<ViewStatus>;
  public in$: Observable<any>;
  public out$: Observable<any>;
  public grid$: Observable<any[]>;

  public data$: Observable<any>;
  public currentSort: [number, string];
  public sortStates: any;
  public sortIndex: number;
  public isLoading = false;
  public hasError = false;
  public selectedDate: string;
  public activePath: string;
  public labelMap = new Map([
    ['calls', 'Calls'],
    ['answers', 'Answers'],
    ['sets', 'Sets'],
    ['setRate', 'Set Rate'],
    ['appointments', 'Appointments'],
    ['hireRate', 'Hire Rate'],
    ['hires', 'Hires'],
    ['noOutcomes', 'Pending Outcomes'],
    ['hires', 'Hires'],
    ['shows', 'Shows'],
    ['showRate', 'Show Rate'],
    ['unqualifiedAtAppointment', 'Unqual At Appt']
  ]);

  /**
   * these definitions are used to:
   *  - define which cards should be present in each report.
   *  - order the cards accordingly
   */
  public cards: any = {
    inbound: ['calls', 'sets', 'appointments', 'shows', 'unqualifiedAtAppointment', 'noOutcomes', 'hires'],
    outbound: ['answers', 'sets', 'appointments', 'shows', 'unqualifiedAtAppointment', 'noOutcomes', 'hires'],
    consultations: ['appointments', 'shows', 'unqualifiedAtAppointment', 'noOutcomes', 'hires']
  };

  public columns = {
    inbound: ['calls', 'sets', 'setRate', 'appointments', 'shows', 'showRate', 'unqualifiedAtAppointment', 'noOutcomes', 'hires'],
    outbound: ['calls', 'answers', 'sets', 'setRate', 'appointments', 'shows', 'showRate', 'unqualifiedAtAppointment', 'noOutcomes', 'hires'],
    consultations: ['appointments', 'shows', 'showRate', 'unqualifiedAtAppointment', 'noOutcomes', 'hires', 'hireRate']
  };

  public teamStats: { [ key: string]: IStatCard[] } = {
    inbound: [],
    outbound: [],
    consultations: []
  };
  public people: any = {
    inbound: [],
    outbound: [],
    consultations: []
  };

  @ViewChild('dateRange', {static : false}) dateRangePicker: FiizDatePickerComponent;


  constructor(
    private store: Store<fromReports.ReportsState>,
  ) {
    this.sortStates = [
      {
        iconClass: 'fa-sort-up',
        sortFn: (field: any) => {
          this.people[this.activePath].sort(this.dynamicSort(field));
        }
      },
      {
        iconClass: 'fa-sort-down',
        sortFn: (field: any) => {
          this.people[this.activePath].sort(this.dynamicSort(field)).reverse();
        }
      }
    ];

    /**
     * TODO make this dynamic
     * allow the developer to set the default column to sort on instantiation
     * likely an @Input property on the component
     * if not set - default to the first column name.
     */
    this.currentSort = [this.sortIndex, 'rank'];
    this.activePath = 'inbound';
  }

  ngAfterViewInit(): void {
    this.store.select(fromReports.selectDateRange).subscribe((data:any) => {
      if( data ){
        const dates = Object.values(data).map( (val:any) => {
          return new Date(val);
        });
        
        this.dateRangePicker.writeValue(dates);
      }
    });
  }

  public async ngOnInit() {
    
    this.status$ = this.store.select(fromReports.selectTeam).pipe(map((res:any) => res.status));

    this.getData();

    this.store.select(fromReports.selectTeam).subscribe((data: any) => {
      data = data.data

    this.teamStats = {
        inbound: [],
        outbound: [],
        consultations: []
      };
    this.people = {
        inbound: [],
        outbound: [],
        consultations: []
      };

      // gather the team metrics into card objects
      for(const key of Object.keys(data)) {
        // inbound, outbound, consultations
        for (const stat of Object.keys(data[key])) {
          if (stat !== 'people' && this.cards[key].includes(stat)) {
            (<IStatCard[]>this.teamStats[key]).push({
              label: this.getLabel(stat, null),
              value: data[this.activePath][stat],
              order: this.cards[this.activePath].indexOf(stat)
            });
          } else if (stat === 'people') {
            this.people[key] = [...data[this.activePath][stat]];
          }
        }
        this.teamStats[key] = (<IStatCard[]>this.teamStats[key]).sort((a, b) => a.order - b.order);
      }

      return data;

    });
  }

  goTo($event: string) {
    this.activePath = $event;
  }

  getData() {
    this.store.dispatch(reportsActions.FetchTeam());
  }


  public sortField(field: string) {
    if (field !== this.currentSort[1] || this.sortIndex === this.sortStates.length - 1) {
      this.sortIndex = 0;
      this.currentSort = [this.sortIndex, field];
    } else {
      this.sortIndex++;
    }
    this.currentSort = [this.sortIndex, field];
    this.sortStates[this.currentSort[0]].sortFn(field);
  }

  private dynamicSort(property: string) {
    let sortOrder = 1;

    // if (property[0] === '-') {
    //   sortOrder = -1;
    //   property = property.substr(1);
    // }

    return function (a: any, b: any) {

      // sort numbers/floats/currencies
      if (typeof a[property] === 'number') {
        if (sortOrder === -1) {
          return b[property] - a[property];
        } else {
          return a[property] - b[property];
        }
      }

      // alphabetic string sort
      if (typeof a[property] === 'string' && a[property].indexOf(':') === -1) {
        // sort strings alphabetically
        if (sortOrder === -1) {
          return b[property].localeCompare(a[property]);
        } else {
          return a[property].localeCompare(b[property]);
        }
      }

      // ratio string sort
      if (typeof a[property] === 'string' && a[property].indexOf(':') !== -1) {
        if (sortOrder === -1) {
          return b[property].split(':')[0] - a[property].split(':')[0];
        } else {
          return a[property].split(':')[0] - b[property].split(':')[0];
        }
      }

    };
  }

  showTooltip(stat: any) {
    return ['Sets', 'Shows', 'Hires'].includes(stat.label);
  }

  getRateKey(stat: any) {
    const singularLabel = stat.label.slice(0, stat.label.length - 1);
    return singularLabel.toLowerCase() + 'Rate';
  }

  getLabel(key: string, context: null | 'table') {
    if (this.activePath === 'outbound' && key === 'answers' && context !== 'table') {
      return 'Answers/Calls';
    }
    return this.labelMap.get(key);
  }

  public getChangedValues( value:any ){
    const range = {
      startDate : dayjs(value.from).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      endDate : dayjs(value.to).endOf('day').format('YYYY-MM-DD HH:mm:ss')
    };
    this.store.dispatch(reportsActions.SetDateRangeAction(range));
    this.store.dispatch(reportsActions.FetchTeam());
  }

  get agentOrConsultant() {
    return ['inbound', 'outbound'].includes(this.activePath) ? 'Agent' : 'Consultant';
  }
}
