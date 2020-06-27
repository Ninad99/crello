import { Component, OnInit, OnDestroy } from '@angular/core';
import { moveItemInArray, transferArrayItem, CdkDragDrop } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'src/app/models/project.model';
import { Board } from 'src/app/models/board.model';
import { ProjectService } from '../project.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateBoardDialogComponent } from '../dialog-components/create-board-dialog.component';
import { SnackService } from '../../services/snack.service';
import { Task } from 'src/app/models/task.model';
import { CreateTaskDialogComponent } from '../dialog-components/create-task-dialog.component';
import { ViewTaskDialogComponent } from '../dialog-components/view-task-dialog.component';

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

  boardTasks: Map<string, Task[]>;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private dialog: MatDialog,
    private snackService: SnackService
  ) {
    this.project = null;
    this.boards = [];
    this.loading = true;
    this.boardTasks = new Map<string, Task[]>();
  }

  ngOnInit(): void {
    this._projectSubscription = this.projectService
      .getProject(this.route.snapshot.params.id)
      .subscribe(async (project: Project) => {
        this.project = project;
        this.boards = await this.projectService.getProjectBoards(project.boards);
        for (const board of this.boards) {
          this.boardTasks.set(board.id, board.tasks);
        }
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

    if (this._dialogSubscription) this._dialogSubscription.unsubscribe();
    this._dialogSubscription = dialogRef.afterClosed().subscribe((result: { saved: boolean }) => {
      if (result?.saved) {
        this.snackService.openWithMessage('Success!', 'Dismiss');
      }
    });
  }

  taskDrop(event: CdkDragDrop<Task[]>, boardId: string): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.boardTasks.get(boardId), event.previousIndex, event.currentIndex);
      this.projectService.updateSingleBoardTasks(boardId, this.boardTasks.get(boardId));
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const prevContainerId = event.previousContainer.id;
      const currContainerId = event.container.id;
      const prevContainerData = event.previousContainer.data;
      const currContainerData = event.container.data;
      this.projectService.updateMultipleBoardTasks(
        prevContainerId,
        currContainerId,
        prevContainerData,
        currContainerData
      );
    }
  }

  async deleteBoard(boardId: string): Promise<void> {
    const isConfirmed = confirm('Are you sure?');

    if (isConfirmed) {
      try {
        await this.projectService.deleteBoard(boardId, this.route.snapshot.params.id);
        this.snackService.openWithMessage('Successfully deleted!', 'Dismiss');
      } catch (err) {
        this.snackService.openWithMessage('Something went wrong... try again?', 'Dismiss');
      }
    }
  }

  openNewTaskDialog(boardId: string): void {
    const dialogRef = this.dialog.open(CreateTaskDialogComponent, {
      width: '600px',
      data: boardId
    });

    if (this._dialogSubscription) this._dialogSubscription.unsubscribe();
    this._dialogSubscription = dialogRef
      .afterClosed()
      .subscribe((result: { saved: boolean; task: Task }) => {
        if (result?.saved) {
          this.snackService.openWithMessage('Success!', 'Dismiss');
          this.boardTasks.get(boardId).push(result.task);
        } else if (result && !result?.saved && !result?.task) {
          this.snackService.openWithMessage('Something went wrong... try again?', 'Dismiss');
        }
      });
  }

  openEditTaskDialog(task: Task, index: number, boardId: string, boardTitle: string): void {
    const dialogRef = this.dialog.open(ViewTaskDialogComponent, {
      width: '600px',
      data: {
        task: task,
        index: index,
        boardId: boardId,
        boardName: boardTitle
      }
    });

    if (this._dialogSubscription) this._dialogSubscription.unsubscribe();
    this._dialogSubscription = dialogRef
      .afterClosed()
      .subscribe((result: { saved: boolean; task: Task; deleted: boolean }) => {
        if (result?.saved) {
          this.snackService.openWithMessage('Updated!', 'Dismiss');
          if (result?.deleted) {
            const tasks = this.boardTasks.get(boardId).filter((task, idx) => idx !== index);
            this.boardTasks.set(boardId, tasks);
          } else {
            this.boardTasks.get(boardId)[index] = result.task;
          }
        } else if (result && !result?.saved && !result?.task) {
          this.snackService.openWithMessage('Something went wrong... try again?', 'Dismiss');
        }
      });
  }
}
