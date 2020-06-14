import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BoardService } from '../services/board.service';
import { Task } from '../../models/task.model';

interface TaskData {
  task: Task;
  isNew: boolean;
  boardId: string;
  idx: number;
}

@Component({
  selector: 'app-task-dialog',
  template: `
    <h1 mat-dialog-title>Task</h1>
    <div mat-dialog-content class="content">
      <mat-form-field>
        <textarea
          placeholder="Task description"
          matInput
          [(ngModel)]="data.task.description"
        ></textarea>
      </mat-form-field>
      <br />
      <mat-button-toggle-group #group="matButtonToggleGroup" [(ngModel)]="data.task.label">
        <mat-button-toggle *ngFor="let opt of labelOptions" [value]="opt">
          <mat-icon [ngClass]="opt">{{ opt === 'gray' ? 'check_circle' : 'lens' }}</mat-icon>
        </mat-button-toggle>
      </mat-button-toggle-group>
    </div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="data" cdkFocusInitial>
        {{ data.isNew ? 'Add Task' : 'Update Task' }}
      </button>
      <app-delete-button (delete)="handleTaskDelete()" *ngIf="!data.isNew"></app-delete-button>
    </div>
  `,
  styleUrls: ['./task-dialog.component.scss']
})
export class TaskDialogComponent {
  labelOptions = ['purple', 'blue', 'green', 'yellow', 'red', 'gray'];

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    private boardService: BoardService,
    @Inject(MAT_DIALOG_DATA) public data: TaskData | { task: Task; isNew: boolean; boardId: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleTaskDelete(): void {
    this.boardService.removeTask(this.data.boardId, this.data.task);
    this.dialogRef.close();
  }
}
