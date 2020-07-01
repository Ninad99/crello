import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectRoutingModule } from './project-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { CreateProjectDialogComponent } from './dialog-components/create-project-dialog.component';
import { CreateBoardDialogComponent } from './dialog-components/create-board-dialog.component';
import { CreateTaskDialogComponent } from './dialog-components/create-task-dialog.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { KanbanBoardsComponent } from './kanban-boards/kanban-boards.component';
import { ViewTaskDialogComponent } from './dialog-components/view-task-dialog.component';
import { CountCompletePipe } from './count-complete.pipe';

@NgModule({
  declarations: [
    ProjectListComponent,
    CreateProjectDialogComponent,
    CreateBoardDialogComponent,
    KanbanBoardsComponent,
    CreateTaskDialogComponent,
    ViewTaskDialogComponent,
    CountCompletePipe
  ],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    SharedModule,
    DragDropModule,
    MatDialogModule,
    TextFieldModule,
    MatCheckboxModule
  ],
  entryComponents: [
    CreateProjectDialogComponent,
    CreateBoardDialogComponent,
    CreateTaskDialogComponent,
    ViewTaskDialogComponent
  ]
})
export class ProjectModule {}
