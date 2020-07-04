import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { CreateBoardDialogComponent } from './create-board-dialog.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProjectService } from '../project.service';
import { ReactiveFormsModule } from '@angular/forms';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

const mockDialogData = {
  projectId: 'projectId',
  order: 1
};

describe('CreateBoardDialogComponent', () => {
  let component: CreateBoardDialogComponent;
  let fixture: ComponentFixture<CreateBoardDialogComponent>;
  let el: DebugElement;

  let projectServiceSpy: jasmine.SpyObj<ProjectService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CreateBoardDialogComponent>>;

  beforeEach(async(() => {
    projectServiceSpy = jasmine.createSpyObj('ProjectService', ['createBoard']);
    projectServiceSpy.createBoard.and.returnValue(Promise.resolve());

    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    dialogRefSpy.close.and.returnValue();

    TestBed.configureTestingModule({
      declarations: [CreateBoardDialogComponent],
      imports: [ReactiveFormsModule, MatDialogModule, MatProgressSpinnerModule],
      providers: [
        { provide: ProjectService, useValue: projectServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBoardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a spinner when loading', () => {
    component.loading = true;
    fixture.detectChanges();
    const spinner = el.query(By.css('mat-spinner')).nativeElement;
    expect(spinner).toBeDefined();
  });

  it('should have an invalid form state when form fields are empty', () => {
    component.createBoardForm.get('title').setValue('');
    fixture.detectChanges();
    const invalidState = component.createBoardForm.invalid;
    expect(invalidState).toBe(true);
  });

  it('should be valid when a title is entered', () => {
    component.createBoardForm.get('title').setValue('testtitle');
    fixture.detectChanges();
    const invalidState = component.createBoardForm.invalid;
    expect(invalidState).toBeFalse();
  });

  it('should create a board through the project service', () => {
    component.createBoardForm.get('title').setValue('testtitle');
    fixture.detectChanges();
    component.submitForm(new Event('submit'));
    expect(projectServiceSpy.createBoard).toHaveBeenCalled();
  });

  it('should close the dialog after creating a board', fakeAsync(() => {
    component.createBoardForm.get('title').setValue('testtitle');
    fixture.detectChanges();
    component.submitForm(new Event('submit')).then(() => {
      expect(dialogRefSpy.close).toHaveBeenCalled();
    });
  }));
});
