import { Component,  Inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'fiiz-dialog',
  templateUrl: './dialog.html',
  styleUrls: ['./dialog.scss']
})
export class FiizDialogComponent {

  constructor(
    @Inject(DIALOG_DATA) public data: {
      title: string;
      body: string;
      buttons: {
        [key: string]: {
          label: string,
          type: 'submit' | 'cancel' | 'custom' | 'default'
          fn?: Function
        }
      }
    },
    public dialog: DialogRef
  ) {
    Object.assign({
      title: '',
      body: '',
      buttons: {
        default: {
          label: 'Ok', type: 'default', fn: () => {
          }
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
      this.data.buttons['submit'].fn();
    }

    this.dialog.close(1);
  }
}
