import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WorkspaceService } from '../../../../workspace.service';

@Component({
  selector: 'fiiz-page-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class FiizPageHeaderComponent implements OnInit {

  @Input('title') title: string;

  constructor(
    public workspaceService: WorkspaceService
  ) { }

  get workspaceName() {
    if (this.workspaceService.workspace) {
      return this.workspaceService.workspace.attributes.name;
    }
  }

  ngOnInit() {
  }

}
