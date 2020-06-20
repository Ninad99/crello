import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'src/app/models/project.model';
import { Board } from 'src/app/models/board.model';
import { ProjectService } from '../project.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateBoardDialogComponent } from '../dialog-components/create-board-dialog.component';
import { SnackService } from '../../services/snack.service';

@Component({
  selector: 'app-kanban-boards',
  templateUrl: './kanban-boards.component.html',
  styleUrls: ['./kanban-boards.component.scss']
})
export class KanbanBoardsComponent implements OnInit, OnDestroy {
  project: Project;
  boards: Board[];
  loading: boolean;
  _projectSubscription: Subscription;
  _dialogSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private dialog: MatDialog,
    private snackService: SnackService
  ) {
    this.project = null;
    this.boards = [];
    this.loading = true;
  }

  ngOnInit(): void {
    this._projectSubscription = this.projectService
      .getProject(this.route.snapshot.params.id)
      .subscribe(async (project: Project) => {
        this.project = project;
        this.boards = await this.projectService.getProjectBoards(project.boards);
        this.loading = false;
      });
  }

  ngOnDestroy(): void {
    if (this._dialogSubscription) this._dialogSubscription.unsubscribe();
    if (this._projectSubscription) this._projectSubscription.unsubscribe();
  }

  openBoardDialog(boardsCount: number): void {
    const dialogData = {
      projectId: this.route.snapshot.params.id,
      order: boardsCount
    };
    const dialogRef = this.dialog.open(CreateBoardDialogComponent, {
      width: '500px',
      data: dialogData
    });

    this._dialogSubscription = dialogRef.afterClosed().subscribe((result: { saved: boolean }) => {
      if (result?.saved) {
        this.snackService.openWithMessage('Success!', 'Dismiss');
      }
    });
  }
}
