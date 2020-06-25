import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-create-task-dialog',
  template: `
    <div mat-dialog-title class="d-flex justify-content-between align-items-center">
      <h2 class="m-0 p-0 d-flex align-items-center">
        <mat-icon>sticky_note_2</mat-icon>&nbsp;Create a new Task
      </h2>
      <span class="closeButton" (click)="closeDialog()">&times;</span>
    </div>
    <div mat-dialog-content>
      <form [formGroup]="createTaskForm" class="d-flex flex-wrap m-0 p-0">
        <mat-form-field color="accent" class="my-2 col-sm-9 px-1">
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

        <div class="my-2 col-12" formArrayName="checklist">
          <div
            class="d-flex align-items-center"
            *ngFor="let item of taskChecklist.controls; let i = index"
            [formGroupName]="i"
          >
            <mat-checkbox class="mr-3" formControlName="complete"></mat-checkbox>
            <mat-form-field color="accent">
              <mat-label>Item description</mat-label>
              <input matInput type="text" formControlName="title" />
            </mat-form-field>
            <button mat-icon-button (click)="deleteChecklistItem(i)">
              <mat-icon>delete_outline</mat-icon>
            </button>
          </div>
        </div>

        <div class="my-2 col-12">
          <button mat-stroked-button color="accent" (click)="addChecklistItem()">
            Add checklist item
          </button>
        </div>
      </form>
    </div>
    <div mat-dialog-actions class="py-3 d-flex justify-content-end align-items-center">
      <mat-spinner [diameter]="32" class="mr-3" color="accent" *ngIf="loading"></mat-spinner>
      <button
        mat-raised-button
        color="accent"
        [disabled]="createTaskForm.invalid || loading"
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

      mat-form-field {
        width: 100%;
      }
    `
  ]
})
export class CreateTaskDialogComponent implements OnInit {
  createTaskForm: FormGroup;
  loading: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateTaskDialogComponent>,
    private projectService: ProjectService,
    @Inject(MAT_DIALOG_DATA) public boardId: string
  ) {
    this.loading = false;
  }

  ngOnInit(): void {
    this.createTaskForm = this.fb.group({
      title: ['', Validators.required],
      label: ['#000000'],
      description: [''],
      checklist: this.fb.array([])
    });
  }

  async submitForm(event: Event): Promise<void> {
    event.preventDefault();
    this.loading = true;
    const data = this.createTaskForm.value;
    try {
      await this.projectService.createTask(data, this.boardId);
      this.dialogRef.close({ saved: true, task: data });
    } catch (err) {
      this.dialogRef.close({ saved: false, task: null });
    }
    this.loading = false;
  }

  get taskChecklist(): FormArray {
    return this.createTaskForm.get('checklist') as FormArray;
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

  closeDialog(): void {
    this.dialogRef.close();
  }
}
