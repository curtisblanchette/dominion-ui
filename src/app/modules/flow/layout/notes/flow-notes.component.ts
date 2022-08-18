import { AfterViewInit, Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, of, tap, mergeMap, delay, firstValueFrom } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { select, Store } from '@ngrx/store';

import * as fromFlow from '../../store/flow.reducer';
import { FlowService } from '../../flow.service';
import { environment } from '../../../../../environments/environment';

@UntilDestroy()
@Component({
    selector: 'flow-notes',
    templateUrl: './flow-notes.component.html',
    styleUrls: ['./flow-notes.component.scss'],
    animations: [
        trigger("appear", [
                state('*', style({opacity: 0})),
                state('true', style({opacity: 1})),
                state('false', style({opacity: 0})),
                transition("* => true", [
                    animate( ".1s ease-in-out")
                ]),
                transition("* => false", [
                    animate("2s ease-in-out")
                ]),
            ]
        )
    ]
})
export class FlowNotesComponent implements OnInit, AfterViewInit {

  public selectedIndex:number = -1;
  public notes$: Observable<Array<any>> = of([]);
  public isSaving: boolean = false;
  public saveError: Error | null = null;

  public tinymceOptions: Object = {
    branding: false,
    menubar: false,
    toolbar: 'bold italic strikethrough underline align',
    statusbar: false,
    content_style: `
      body {
        font-family: Roboto, Arial, sans-serif;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.5em;
        color: #C6CEED;
      }`
  };

  @ViewChild('tinymce') tinymce: EditorComponent;
  @Output() disableSave: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private store: Store<fromFlow.FlowState>,
    public flowService: FlowService,
    public http: HttpClient
  ) {
    this.disableSave.emit(false); // Default is false
  }

    public async ngOnInit() {
      await this.getHistoricNotes();
    }

    public async ngAfterViewInit() {
      this.tinymce.onKeyUp.pipe(
        untilDestroyed(this),
        map((action: any) => {
          return action.event.currentTarget.innerHTML;
        }),
        debounceTime(750),
        distinctUntilChanged(),
        mergeMap((html) => (this.isSaving = true) && this.saveNotes()),
        tap((res) => {
          if(res instanceof HttpErrorResponse){
            this.saveError = res;
          }
        }),
        delay(200),
        map(() => {
          this.isSaving = false;
        })
      ).subscribe();
    }


    public async getHistoricNotes(){
        const lead = await this.flowService.getVariable('lead');
        const deal = await this.flowService.getVariable('deal');
        const contact = await this.flowService.getVariable('contact');
        let params:string = '';
        if( lead ){
            params += `&leadId=${lead}`;
        }
        if( deal ){
            params += `&dealId=${deal}`;
        }
        if( contact ){
            params += `&contactId=${contact}`;
        }
        // if( params.length ){
        // this.http.get(environment.dominion_api_url + '/notes?' + params).subscribe( (data:any) => {
        //     if( data ){
        //     this.notes$ = of(data);
        //     }
        // });
        // }
        this.http.get(environment.dominion_api_url + '/notes?leadId=159407e4-5677-400a-acb3-88c8b50be5e8&dealId=2cb2a808-d6fb-462c-9dfd-eb5af8b22a40').subscribe( (data:any) => {
            if( data ){
                this.notes$ = of(data);
            }
        });
    }

    public loadNotesInView( object:any, index:number ){
        this.selectedIndex = index;
        if( index == -1 ){
            // TODO : load data from store to display ongoing call ntoes
            this.tinymce.editor.readonly = false;
            this.tinymce.setDisabledState(false);
            this.disableSave.emit(false);
        } else {
            this.tinymce.editor.setContent(object.content);
            this.tinymce.editor.readonly = true;
            this.tinymce.setDisabledState(true);
            this.disableSave.emit(true);
        }
    }

    public saveNotes(): Promise<any | void> {
      return firstValueFrom( this.flowService.updateNote(this.tinymce.editor.getContent()) );
    }


}
