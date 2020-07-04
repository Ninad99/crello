import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { of } from 'rxjs';
import { ProjectListComponent } from './project-list.component';
import { ProjectService } from '../project.service';
import { SnackService } from '../../services/snack.service';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { By } from '@angular/platform-browser';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProjectListComponent', () => {
  let component: ProjectListComponent;
  let fixture: ComponentFixture<ProjectListComponent>;
  let el: DebugElement;
  let mockProjectService: jasmine.SpyObj<ProjectService>;
  let mockMatDialog: jasmine.SpyObj<MatDialog>;
  let mockSnackService: jasmine.SpyObj<SnackService>;

  beforeEach(async(() => {
    mockProjectService = jasmine.createSpyObj<ProjectService>('ProjectService', [
      'createBoard',
      'createProject',
      'createTask',
      'deleteBoard',
      'deleteProject',
      'deleteTask',
      'getProject',
      'getProjectBoards',
      'getUserProjects',
      'updateMultipleBoardTasks',
      'updateSingleBoardTasks',
      'updateTask'
    ]);
    mockMatDialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
    mockSnackService = jasmine.createSpyObj<SnackService>('SnackService', ['openWithMessage']);

    TestBed.configureTestingModule({
      declarations: [ProjectListComponent],
      imports: [MatProgressSpinnerModule, MatListModule, MatIconModule, RouterTestingModule],
      providers: [
        { provide: ProjectService, useValue: mockProjectService },
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: SnackService, useValue: mockSnackService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should open a 'Create Task' mat dialog`, () => {
    component.openCreateProjectDialog();

    expect(mockMatDialog.open).toHaveBeenCalled();
  });

  it('should render a list of 3 projects', () => {
    const mockProjects$ = of([
      {
        uid: 'id1',
        title: 'fakeProject1',
        boards: ['board1', 'board2'],
        projectId: 'projectid1'
      },
      {
        uid: 'id2',
        title: 'fakeProject2',
        boards: ['board1', 'board2'],
        projectId: 'projectid2'
      },
      {
        uid: 'id3',
        title: 'fakeProject3',
        boards: ['board1', 'board2'],
        projectId: 'projectid3'
      }
    ]);

    component.projects$ = mockProjects$;
    fixture.detectChanges();

    const projectsList = el.queryAll(By.css('mat-list-item'));
    expect(projectsList.length).toEqual(3);
  });
});
