import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-board-dialog',
  template: `
    <h1 mat-dialog-title>New Board</h1>
    <div mat-dialog-content>
      <p>What shall we call this board?</p>
      <mat-form-field>
        <input placeholder="title" matInput [(ngModel)]="data.title" />
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-button [mat-dialog-close]="data.title" cdkFocusInitial>
        Create
      </button>
    </div>
  `,
  styles: [
    `
      .content {
        overflow: hidden;
        height: auto;
        padding: 20px;
        width: 100%;
      }

      mat-form-field {
        width: 100%;
      }

      textarea {
        display: block;
        width: 100%;
      }

      .blue {
        color: #71deff;
      }
      .green {
        color: #36e9b6;
      }
      .yellow {
        color: #ffcf44;
      }
      .purple {
        color: #b15cff;
      }
      .gray {
        color: gray;
      }
      .red {
        color: #e74a4a;
      }
    `
  ]
})
export class BoardDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<BoardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
