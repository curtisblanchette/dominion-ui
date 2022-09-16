import { AfterViewInit, Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, of, tap, mergeMap, delay, firstValueFrom } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { EditorComponent } from '@tinymce/tinymce-angular';

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
  public editorLoading:boolean = true;
  public dataLoading:boolean = true;
  public currentCallId:string | undefined;

  public tinymceOptions: Object = {
    base_url: '/tinymce',
    suffix: '.min',
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
    public flowService: FlowService,
    public http: HttpClient
  ) {
    this.disableSave.emit(false); // Default is false
  }

    public async ngOnInit() {
      await this.getHistoricNotes();
      this.currentCallId = this.flowService.callId;
    }

    public async ngAfterViewInit() {
      if( this.tinymce ){
        this.tinymce.onKeyUp.pipe(
          untilDestroyed(this),
          map((action: any) => {
            return action.event.currentTarget.innerHTML;
          }),
          debounceTime(750),
          distinctUntilChanged(),
          mergeMap(async (html) => (this.isSaving = true) && this.saveNotes()),
          delay(200),
          map(() => {
            this.isSaving = false;
          })
        ).subscribe();
      }
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
        if( params.length ){
          this.http.get(environment.dominion_api_url + '/notes?' + params).subscribe( (data:any) => {
              if( data ){
                this.notes$ = of(data);
              }
              this.dataLoading = false;
          });
        } else {
          this.dataLoading = false;
        }
    }

    public async loadNotesInView( object:any, index:number ){
        this.selectedIndex = index;
        if( index == -1 ){
            this.tinymce.editor.setContent( await this.flowService.getNotesFromCache() );
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

    public saveNotes(): void {
      return this.flowService.updateNotesToCache(this.tinymce.editor.getContent());
    }

    public async afterEditorInit( event:any, id:string ){
      if( event ){
        this.editorLoading = false;
        this.tinymce.editor.setContent( await this.flowService.getNotesFromCache() );
        this.tinymce.editor.dom.addClass(document.getElementById(id) as HTMLElement, 'shadow');
      }
    }

}
