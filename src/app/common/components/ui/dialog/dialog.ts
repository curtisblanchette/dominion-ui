import { AfterViewInit, Component, ComponentRef, Inject, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { UntilDestroy } from '@ngneat/until-destroy';

import { FlowNotesComponent } from '../../../../modules/flow/index';

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
  styleUrls: ['./dialog.scss']  
})
export class FiizDialogComponent implements AfterViewInit, OnDestroy {

  public disabled:boolean = false;
  public comp!:ComponentRef<FlowNotesComponent>;
  @ViewChild('flowNotes', { read: ViewContainerRef }) flowNotes!: ViewContainerRef;

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
    if( this.data?.type == 'editor' ){
      this.flowNotes.clear();
      this.comp = this.flowNotes.createComponent(FlowNotesComponent);
      this.comp.instance.disableSave.subscribe((value:boolean) => {
        this.disabled = value;
      })
    }    
  }

  ngOnDestroy(): void {}

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
      if(this.data?.type == 'editor') {
        return submitBtn.fn(this.comp.instance.tinymce.editor.getContent()).then(() => this.dialog.close(1));
      } else {
        return submitBtn.fn().then(() => this.dialog.close(1));
      }
    }
  }

}
