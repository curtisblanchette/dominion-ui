import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'dialog-content',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string;
      subtitle?: string;
      body?: string;
      icon: string;
      cancelText: string;
      submitText: string;
      submitButtonColor?: 'warning' | 'primary' | 'secondary'
    }) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close(0);
  }

  get cancelText() {
    return this.data.cancelText;
  }

  onSubmit() {
    this.dialogRef.close(1);
  }

  get submitText() {
    return this.data.submitText;
  }

  get submitButtonColor() {
    return this.data.submitButtonColor || 'primary';
  }

  get icon() {
    return this.data.icon;
  }

  get title() {
    return this.data.title;
  }

  get subtitle() {
    return this.data.subtitle;
  }

  get body() {
    return this.data.body;
  }
}
