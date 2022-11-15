import { Component, Input } from '@angular/core';

@Component({
  selector: 'fiiz-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class FiizNoteComponent {

  @Input('data') data: any;

  constructor(

  ) {

  }
}
