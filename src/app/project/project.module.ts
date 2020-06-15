import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectRoutingModule } from './project-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';

import { ProjectListComponent } from './project-list/project-list.component';
import { CreateProjectDialogComponent } from './dialog-components/create-project-dialog.component';
import { BoardComponent } from './board/board.component';
@NgModule({
  declarations: [ProjectListComponent, CreateProjectDialogComponent, BoardComponent],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    DragDropModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatListModule
  ],
  entryComponents: [CreateProjectDialogComponent]
})
export class ProjectModule {}