import { Component,  Inject, ViewChild } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { EditorComponent } from '@tinymce/tinymce-angular';

import { FlowService } from '../../../../modules/flow/flow.service';

@Component({
  selector: 'fiiz-dialog',
  templateUrl: './dialog.html',
  styleUrls: ['./dialog.scss']
})
export class FiizDialogComponent {

  public tinymceOptions:Object = {
    branding: false,
    menubar: false,
    toolbar: 'bold italic strikethrough underline align',
    statusbar: false,
    content_style: `
      body {
        font-family: Roboto, Arial, sans-serif;
        font-size: 12px;
        font-weight: 500;
        line-height: 1.5em;
        color: #C6CEED;
      }`
  };

  @ViewChild('editor') editor:EditorComponent;

  constructor(
    @Inject(DIALOG_DATA) public data: {
      title: string;
      body?: string;
      type?: string;
      buttons: {
        [key: string]: {
          label: string,
          type: 'submit' | 'cancel' | 'custom' | 'default'
          fn?: Function
        }
      }
    },
    public dialog: DialogRef,
    public flowService: FlowService
  ) {
    this.data = Object.assign({
      title: 'Warning',
      buttons: {
        default: {
          label: 'Ok',
          type: 'default',
          fn: () => {}
        }
      }
    }, this.data);
  }

  onNoClick(): void {
    this.onCancel();
  }

  onCancel() {
    if(typeof this.data?.buttons['cancel']?.fn === 'function') {
      this.data.buttons['cancel'].fn();
    }

    this.dialog.close();
  }

  onSubmit() {
    if(typeof this.data?.buttons['submit']?.fn === 'function') {
      if( this.data.type == 'editor' ){
        this.flowService.updateNote(this.editor.editor.getContent());
      }
      this.data.buttons['submit'].fn();
    }

    this.dialog.close(1);
  }
}
