import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanBoardsComponent } from './kanban-boards.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { RouterTestingModule } from '@angular/router/testing';
import { SnackService } from 'src/app/services/snack.service';
import { ProjectService } from '../project.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Project } from '../../models/project.model';
import { of } from 'rxjs';

const mockProjectData = {
  uid: 'mockUid',
  title: 'mockTitle',
  boards: ['boardid1', 'boardid2'],
  projectId: 'mockprojectId'
};

describe('KanbanBoardsComponent', () => {
  let component: KanbanBoardsComponent;
  let fixture: ComponentFixture<KanbanBoardsComponent>;
  let mockProject: Project;

  let snackServiceSpy: jasmine.SpyObj<SnackService>;
  let projectServiceSpy: jasmine.SpyObj<ProjectService>;

  beforeEach(async(() => {
    mockProject = mockProjectData;

    snackServiceSpy = jasmine.createSpyObj('SnackService', ['openWithMessage']);
    snackServiceSpy.openWithMessage.and.returnValue();

    projectServiceSpy = jasmine.createSpyObj('ProjectService', [
      'deleteBoard',
      'updateSingleBoardTasks',
      'updateMultipleBoardTasks',
      'getProjectBoards',
      'getProject'
    ]);
    projectServiceSpy.deleteBoard.and.returnValue(Promise.resolve());
    projectServiceSpy.updateSingleBoardTasks.and.returnValue(Promise.resolve());
    projectServiceSpy.updateMultipleBoardTasks.and.returnValue(Promise.resolve());
    projectServiceSpy.getProjectBoards.and.returnValue(Promise.resolve([]));
    projectServiceSpy.getProject.and.returnValue(of(mockProject));

    TestBed.configureTestingModule({
      declarations: [KanbanBoardsComponent],
      imports: [RouterTestingModule, MatDialogModule, DragDropModule],
      providers: [
        { provide: SnackService, useValue: snackServiceSpy },
        { provide: ProjectService, useValue: projectServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KanbanBoardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
