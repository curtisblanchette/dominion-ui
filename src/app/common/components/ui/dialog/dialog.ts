import { AfterViewInit, Component, Inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, delay, distinctUntilChanged, map } from 'rxjs/operators';
import { mergeMap, tap } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';

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

  @ViewChild('tinymce') tinymce: EditorComponent;

  constructor(
    @Inject(DIALOG_DATA) public data: IDialogData,
    public dialog: DialogRef
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
        return submitBtn.fn(this.tinymce.editor.getContent()).then(() => this.dialog.close(1));
      } else {
        return submitBtn.fn().then(() => this.dialog.close(1));
      }
    }
  }
}
