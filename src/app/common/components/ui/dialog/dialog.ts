import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { EditorComponent } from '@tinymce/tinymce-angular';

import { FlowService } from '../../../../modules/flow/flow.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, delay, distinctUntilChanged, map } from 'rxjs/operators';
import { mergeMap, Observable, of, tap } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

interface IDialogButton {
  label: string,
  type: 'submit' | 'cancel' | 'custom' | 'default'
  class?: string;
  fn(...args: any[]): Promise<any | void>
}

interface IDialogData {
  title: string;
  body?: string;
  type?: 'editor' | 'html';
  buttons: {
    [key:string]: IDialogButton
  };
}

@UntilDestroy()
@Component({
  selector: 'fiiz-dialog',
  templateUrl: './dialog.html',
  styleUrls: ['./dialog.scss'],
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
    ])
  ]
})
export class FiizDialogComponent implements AfterViewInit {

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

  public isSaving: boolean = false;
  public saveError: Error | null = null;
  public notes$: Observable<Array<any>>;
  public selectedIndex:number = -1;
  

  @ViewChild('tinymce') tinymce: EditorComponent;

  constructor(
    @Inject(DIALOG_DATA) public data: IDialogData,
    public dialog: DialogRef,
    public flowService: FlowService,
    public http: HttpClient
  ) {
    this.data = Object.assign({
      title: 'Warning',
      buttons: {
        default: {
          label: 'Ok',
          type: 'default',
          class: 'warning',
          fn: () => {}
        }
      }
    }, this.data);
  }

  public ngAfterViewInit() {
    if (this.tinymce) {
      this.tinymce.onKeyUp.pipe(
        untilDestroyed(this),
        map((action: any) => {
          return action.event.currentTarget.innerHTML;
        }),
        debounceTime(750),
        distinctUntilChanged(),
        mergeMap((html) => (this.isSaving = true) && this.onSubmit()),
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
      this.getHistoricNotes();
    }
  }

  onNoClick(): void {
    this.onCancel();
  }

  public async onCancel(): Promise<any | void> {
    const cancelBtn: IDialogButton = this.data.buttons['cancel'];
    if(cancelBtn.fn) {
      return cancelBtn.fn();
    }
    this.dialog.close();
  }

  public async onSubmit(): Promise<any | void> {
    const submitBtn: IDialogButton = this.data.buttons['submit'];

    if (submitBtn.fn) {
      if(this.tinymce?.editor) {
        return submitBtn.fn(this.tinymce.editor.getContent());
      } else {
        return submitBtn.fn().then(() => this.dialog.close(1));
      }

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
      });
    }
  }

  public loadNotes( object:any, index:number ){
    this.selectedIndex = index;
    if( index == -1 ){
      // Load data from ngrx
    } else {
      this.tinymce.editor.setContent(object.content);
    }

  }

}
