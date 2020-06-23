import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-create-board-dialog',
  template: `
    <div mat-dialog-title class="d-flex justify-content-between align-items-center">
      <h3 class="m-0 p-0">Create a new Board</h3>
      <span class="closeButton" (click)="closeDialog()">&times;</span>
    </div>
    <div mat-dialog-content>
      <form [formGroup]="createBoardForm">
        <mat-form-field color="accent">
          <input placeholder="Title" matInput type="text" formControlName="title" />
          <mat-hint>Give a title to this board</mat-hint>
          <mat-error>The title is required, and should be atleast 3 characters long!</mat-error>
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions class="py-3 d-flex justify-content-end align-items-center">
      <span *ngIf="error">{{ error.message }}</span>
      <mat-spinner [diameter]="32" class="mr-3" *ngIf="loading"></mat-spinner>
      <button
        mat-raised-button
        color="primary"
        [disabled]="createBoardForm.invalid || loading"
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
export class CreateBoardDialogComponent implements OnInit {
  createBoardForm: FormGroup;
  loading: boolean;
  error: Error;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateBoardDialogComponent>,
    private projectService: ProjectService,
    @Inject(MAT_DIALOG_DATA) public dialogData: { projectId: string; order: number }
  ) {
    this.loading = false;
  }

  ngOnInit(): void {
    this.createBoardForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  async submitForm(event: Event): Promise<void> {
    event.preventDefault();

    const title = this.createBoardForm.value.title;
    this.loading = true;
    try {
      await this.projectService.createBoard({
        title: title,
        order: this.dialogData.order,
        projectId: this.dialogData.projectId
      });
      this.dialogRef.close({ saved: true });
    } catch (err) {
      this.error = err;
    }
    this.loading = false;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
