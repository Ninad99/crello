import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, Observable } from 'rxjs';
import { ProjectService } from '../project.service';
import { SnackService } from '../../services/snack.service';
import { CreateProjectDialogComponent } from '../dialog-components/create-project-dialog.component';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit, OnDestroy {
  _subscription: Subscription;
  projects$: Observable<Project[]>;

  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog,
    private snackService: SnackService
  ) {}

  ngOnInit(): void {
    this.projects$ = this.projectService.getUserProjects();
  }

  ngOnDestroy(): void {
    if (this._subscription) this._subscription.unsubscribe();
  }

  openCreateProjectDialog(): void {
    const dialogRef = this.dialog.open(CreateProjectDialogComponent, {
      width: '400px'
    });

    this._subscription = dialogRef.afterClosed().subscribe(async (result: { created: boolean }) => {
      if (result?.created) {
        this.snackService.openWithMessage('Successfully created!', 'Dismiss');
        this._subscription.unsubscribe();
      }
    });
  }

  async confirmDelete(projectId: string): Promise<void> {
    const isConfirmed = confirm('Are you sure?');

    if (isConfirmed) {
      await this.projectService.deleteProject(projectId);
      this.snackService.openWithMessage('Deleted project', 'Dismiss');
    }
  }
}
