import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-create-project-dialog',
  template: `
    <div mat-dialog-title class="d-flex justify-content-between align-items-center">
      <h3 class="m-0 p-0">Create a new Project</h3>
      <span class="closeButton" (click)="closeDialog()">&times;</span>
    </div>
    <div mat-dialog-content>
      <form [formGroup]="createProjectForm">
        <mat-form-field>
          <input placeholder="Title" matInput type="text" formControlName="title" />
          <mat-hint>Enter the title of your project</mat-hint>
          <mat-error>The title is required, and should be atleast 3 characters long!</mat-error>
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions class="py-3 d-flex justify-content-end align-items-center">
      <mat-spinner [diameter]="32" ngClass="mr-3" *ngIf="loading"></mat-spinner>
      <button
        mat-raised-button
        color="primary"
        [disabled]="createProjectForm.invalid || loading"
        (click)="submitForm($event)"
      >
        Submit
      </button>
    </div>
  `,
  styles: [
    `
      .closeButton {
        font-size: 1.25rem;
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
export class CreateProjectDialogComponent implements OnInit {
  createProjectForm: FormGroup;
  loading: boolean;
  error: Error;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateProjectDialogComponent>,
    private projectService: ProjectService
  ) {
    this.loading = false;
  }

  ngOnInit(): void {
    this.createProjectForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  async submitForm(event: Event): Promise<void> {
    event.preventDefault();
    const title = this.createProjectForm.value.title;
    this.loading = true;
    try {
      await this.projectService.createProject(title);
      this.dialogRef.close({ created: true });
    } catch (err) {
      this.error = err;
    }
    this.loading = false;
  }
}
