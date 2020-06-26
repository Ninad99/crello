import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectRoutingModule } from './project-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { CreateProjectDialogComponent } from './dialog-components/create-project-dialog.component';
import { CreateBoardDialogComponent } from './dialog-components/create-board-dialog.component';
import { CreateTaskDialogComponent } from './dialog-components/create-task-dialog.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { KanbanBoardsComponent } from './kanban-boards/kanban-boards.component';
import { ViewTaskDialogComponent } from './dialog-components/view-task-dialog.component';

@NgModule({
  declarations: [
    ProjectListComponent,
    CreateProjectDialogComponent,
    CreateBoardDialogComponent,
    KanbanBoardsComponent,
    CreateTaskDialogComponent,
    ViewTaskDialogComponent
  ],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    DragDropModule,
    MatDialogModule,
    MatListModule,
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
