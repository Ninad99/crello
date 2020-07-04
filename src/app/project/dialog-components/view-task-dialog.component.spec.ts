import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { ViewTaskDialogComponent } from './view-task-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { ProjectService } from '../project.service';
import { By } from '@angular/platform-browser';

const mockDialogData = {
  task: {
    description: 'mock description',
    label: 'mock label',
    checklist: [],
    title: 'mock title'
  },
  index: 1,
  boardId: 'mockBoardId',
  boardName: 'mockBoardName'
};

describe('ViewTaskDialogComponent', () => {
  let component: ViewTaskDialogComponent;
  let fixture: ComponentFixture<ViewTaskDialogComponent>;
  let el: DebugElement;

  let projectServiceSpy: jasmine.SpyObj<ProjectService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ViewTaskDialogComponent>>;

  beforeEach(async(() => {
    projectServiceSpy = jasmine.createSpyObj('ProjectService', ['updateTask', 'deleteTask']);
    projectServiceSpy.updateTask.and.returnValue(Promise.resolve());
    projectServiceSpy.deleteTask.and.returnValue(Promise.resolve());

    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    dialogRefSpy.close.and.returnValue();

    TestBed.configureTestingModule({
      declarations: [ViewTaskDialogComponent],
      imports: [ReactiveFormsModule, MatDialogModule, MatProgressSpinnerModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: ProjectService, useValue: projectServiceSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a spinner while loading', () => {
    component.loading = true;
    fixture.detectChanges();
    const spinner = el.query(By.css('mat-spinner')).nativeElement;
    expect(spinner).toBeDefined();
  });

  it('should have an invalid form state when form fields are empty', () => {
    component.taskForm.get('title').setValue('');
    fixture.detectChanges();
    const invalidState = component.taskForm.invalid;
    expect(invalidState).toBe(true);
  });

  it('should be valid when a title is entered', () => {
    component.taskForm.get('title').setValue('testtitle');
    fixture.detectChanges();
    const invalidState = component.taskForm.invalid;
    expect(invalidState).toBeFalse();
  });

  it('should add a checklist item on click', () => {
    const itemsCount = component.taskChecklist.length;
    component.addChecklistItem();
    const updatedItemsCount = component.taskChecklist.length;
    expect(updatedItemsCount).toBeGreaterThan(itemsCount);
  });

  it('should remove a checklist item on click', () => {
    component.addChecklistItem();
    component.addChecklistItem();
    const itemsCount = component.taskChecklist.length;
    component.deleteChecklistItem(0);
    const updatedItemsCount = component.taskChecklist.length;
    expect(updatedItemsCount).toBeLessThan(itemsCount);
  });

  it('should update the task on submission of form', () => {
    component.submitForm(new Event('submit'));
    expect(projectServiceSpy.updateTask).toHaveBeenCalled();
  });

  it('should delete a task on click', () => {
    component.deleteTask();
    expect(projectServiceSpy.deleteTask).toHaveBeenCalled();
  });

  it('should close the dialog after creating a project', fakeAsync(() => {
    component.taskForm.get('title').setValue('testtitle');
    fixture.detectChanges();
    component.submitForm(new Event('submit')).then(() => {
      expect(dialogRefSpy.close).toHaveBeenCalled();
    });
  }));
});
