import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ProjectService } from '../project.service';
import { Task, ChecklistItem } from '../../models/task.model';

interface EditTaskData {
  task: Task;
  index: number;
  boardId: string;
  boardName: string;
}

@Component({
  selector: 'app-view-task-dialog',
  template: `
    <div
      mat-dialog-title
      class="py-2 d-flex justify-content-between align-items-center"
      [style.borderTop]="'2px solid'"
      [style.borderColor]="taskLabel"
    >
      <h2 *ngIf="_operation === 'view'" class="m-0 p-0 d-flex align-items-center">
        <mat-icon>sticky_note_2</mat-icon>&nbsp;&nbsp;{{ taskTitle }}&nbsp;
        <em>({{ taskData.boardName }})</em>&nbsp;&nbsp;
        <button
          (click)="toggleEdit()"
          mat-icon-button
          color="accent"
          matTooltip="Edit"
          matTooltipPosition="right"
        >
          <mat-icon>create</mat-icon></button
        ><br />
        <button
          (click)="deleteTask()"
          mat-icon-button
          color="warn"
          matTooltip="Delete Task"
          matTooltipPosition="right"
        >
          <mat-icon>delete</mat-icon></button
        ><br />
      </h2>
      <span *ngIf="_operation === 'edit'">
        <em>Editing</em>
        <button
          (click)="toggleEdit()"
          mat-icon-button
          color="accent"
          matTooltip="Done"
          matTooltipPosition="right"
        >
          <mat-icon>done</mat-icon>
        </button></span
      >
      <span class="closeButton" (click)="closeDialog()">&times;</span>
    </div>
    <form
      [formGroup]="taskForm"
      mat-dialog-content
      class="d-flex flex-column justify-content-center align-items-start"
    >
      <div *ngIf="_operation === 'view'">
        <h3 class="mx-0 mb-2 p-0 d-flex align-items-center">
          <mat-icon>description</mat-icon>&nbsp;&nbsp;Description
        </h3>
        <p class="mx-0 my-2 p-0 pl-3">{{ taskDescription }}</p>
        <h3 class="mx-0 my-2 p-0 d-flex align-items-center">
          <mat-icon>playlist_add_check</mat-icon>&nbsp;&nbsp;Checklist
        </h3>
      </div>

      <div *ngIf="_operation === 'edit'">
        <mat-form-field color="accent" class="mt-0 mb-2 col-sm-9 px-1">
          <mat-label>Title</mat-label>
          <input placeholder="Title" matInput type="text" formControlName="title" />
          <mat-hint>Enter the title for this task</mat-hint>
          <mat-error>The title is required!</mat-error>
        </mat-form-field>

        <mat-form-field color="accent" class="my-2 col-sm-3 px-1">
          <mat-label>Label Color</mat-label>
          <input placeholder="Label" matInput type="color" formControlName="label" />
        </mat-form-field>

        <mat-form-field color="accent" class="my-2 col-md-12 px-1">
          <mat-label>Description</mat-label>
          <textarea
            formControlName="description"
            matInput
            cdkTextareaAutosize
            #autosize="cdkTextareaAutosize"
            cdkAutosizeMinRows="2"
            cdkAutosizeMaxRows="5"
          ></textarea>
          <mat-hint>Add a more detailed description...</mat-hint>
        </mat-form-field>
      </div>

      <div class="my-2 col-12" formArrayName="checklist">
        <div
          class="d-flex align-items-center"
          *ngFor="let item of taskChecklist.controls; let i = index"
          [formGroupName]="i"
        >
          <mat-checkbox class="mr-3" formControlName="complete"></mat-checkbox>
          <h3
            *ngIf="_operation === 'view'"
            [ngClass]="{
              'm-0': true,
              'strike-through': item.value.complete
            }"
          >
            {{ item.value.title }}
          </h3>

          <mat-form-field *ngIf="_operation === 'edit'" color="accent">
            <mat-label>Item description</mat-label>
            <input matInput type="text" formControlName="title" />
          </mat-form-field>
          <button mat-icon-button *ngIf="_operation === 'edit'" (click)="deleteChecklistItem(i)">
            <mat-icon>delete_outline</mat-icon>
          </button>
        </div>

        <div class="my-2 col-12" *ngIf="_operation === 'edit'">
          <button mat-stroked-button color="accent" (click)="addChecklistItem()">
            Add checklist item
          </button>
        </div>
      </div>
    </form>
    <div mat-dialog-actions class="py-3 d-flex justify-content-end align-items-center">
      <mat-spinner [diameter]="32" class="mr-3" color="accent" *ngIf="loading"></mat-spinner>
      <button
        mat-raised-button
        color="accent"
        [disabled]="taskForm.invalid || loading"
        (click)="submitForm($event)"
      >
        Submit
      </button>
    </div>
  `,
  styles: [
    `
      .closeButton {
        font-size: 1.75rem;
        cursor: pointer;
      }

      .closeButton:hover {
        color: red;
      }

      .strike-through {
        text-decoration: line-through;
      }

      mat-form-field {
        width: 100%;
      }
    `
  ]
})
export class ViewTaskDialogComponent implements OnInit {
  borderStyle: string;
  _operation: 'view' | 'edit';

  taskForm: FormGroup;
  loading: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ViewTaskDialogComponent>,
    private projectService: ProjectService,
    @Inject(MAT_DIALOG_DATA) public taskData: EditTaskData
  ) {
    this._operation = 'view';
    this.loading = false;
  }

  ngOnInit(): void {
    const checklistItems = this.taskData.task.checklist.map((item: ChecklistItem) => {
      return this.fb.group({
        title: item.title,
        complete: item.complete
      });
    });

    this.taskForm = this.fb.group({
      title: [this.taskData.task.title, Validators.required],
      label: [this.taskData.task.label],
      description: [this.taskData.task.description],
      checklist: this.fb.array(checklistItems)
    });
  }

  get taskTitle(): string {
    return this.taskForm.get('title').value as string;
  }

  get taskLabel(): string {
    return this.taskForm.get('label').value as string;
  }

  get taskDescription(): string {
    return this.taskForm.get('description').value as string;
  }

  get taskChecklist(): FormArray {
    return this.taskForm.get('checklist') as FormArray;
  }

  toggleEdit(): void {
    if (this._operation === 'view') {
      this._operation = 'edit';
    } else {
      this._operation = 'view';
    }
  }

  addChecklistItem(): void {
    const item = this.fb.group({
      title: '',
      complete: false
    });

    this.taskChecklist.push(item);
  }

  deleteChecklistItem(index: number): void {
    this.taskChecklist.removeAt(index);
  }

  async deleteTask(): Promise<void> {
    const data = this.taskForm.value;
    this.loading = true;
    try {
      await this.projectService.deleteTask(this.taskData.boardId, data);
      this.dialogRef.close({ saved: true, task: data, deleted: true });
    } catch (err) {
      this.dialogRef.close({ saved: false, task: null });
    }
    this.loading = false;
  }

  async submitForm(event: Event): Promise<void> {
    event.preventDefault();
    const data = this.taskForm.value;
    this.loading = true;
    try {
      await this.projectService.updateTask(data, this.taskData.boardId, this.taskData.index);
      this.dialogRef.close({ saved: true, task: data, deleted: false });
    } catch (err) {
      this.dialogRef.close({ saved: false, task: null });
    }
    this.loading = false;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
