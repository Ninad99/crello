import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectListComponent } from './project-list/project-list.component';
import { KanbanBoardsComponent } from './kanban-boards/kanban-boards.component';

const routes: Routes = [
  { path: '', component: ProjectListComponent },
  { path: ':id', component: KanbanBoardsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule {}
