import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ProjectService } from '../project.service';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { By } from '@angular/platform-browser';
import { CreateTaskDialogComponent } from './create-task-dialog.component';
import { TextFieldModule } from '@angular/cdk/text-field';

const mockDialogData = 'mockBoardId';

describe('CreateTaskDialogComponent', () => {
  let component: CreateTaskDialogComponent;
  let fixture: ComponentFixture<CreateTaskDialogComponent>;
  let el: DebugElement;

  let projectServiceSpy: jasmine.SpyObj<ProjectService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CreateTaskDialogComponent>>;

  beforeEach(async(() => {
    projectServiceSpy = jasmine.createSpyObj('ProjectService', ['createTask']);
    projectServiceSpy.createTask.and.returnValue(Promise.resolve());

    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    dialogRefSpy.close.and.returnValue();

    TestBed.configureTestingModule({
      declarations: [CreateTaskDialogComponent],
      imports: [MatDialogModule, MatProgressSpinnerModule, ReactiveFormsModule, TextFieldModule],
      providers: [
        { provide: ProjectService, useValue: projectServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTaskDialogComponent);
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
    component.createTaskForm.get('title').setValue('');
    fixture.detectChanges();
    const invalidState = component.createTaskForm.invalid;
    expect(invalidState).toBe(true);
  });

  it('should be valid when a title is entered', () => {
    component.createTaskForm.get('title').setValue('testtitle');
    fixture.detectChanges();
    const invalidState = component.createTaskForm.invalid;
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

  it('should create a project through the project service', () => {
    component.createTaskForm.get('title').setValue('testtitle');
    fixture.detectChanges();
    component.submitForm(new Event('submit'));
    expect(projectServiceSpy.createTask).toHaveBeenCalled();
  });

  it('should close the dialog after creating a project', fakeAsync(() => {
    component.createTaskForm.get('title').setValue('testtitle');
    fixture.detectChanges();
    component.submitForm(new Event('submit')).then(() => {
      expect(dialogRefSpy.close).toHaveBeenCalled();
    });
  }));
});
