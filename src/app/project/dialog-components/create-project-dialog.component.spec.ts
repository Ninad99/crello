import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateProjectDialogComponent } from './create-project-dialog.component';
import { ProjectService } from '../project.service';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { By } from '@angular/platform-browser';
import { DocumentReference } from '@angular/fire/firestore';

describe('CreateProjectDialogComponent', () => {
  let component: CreateProjectDialogComponent;
  let fixture: ComponentFixture<CreateProjectDialogComponent>;
  let el: DebugElement;

  let mock: DocumentReference;

  let projectServiceSpy: jasmine.SpyObj<ProjectService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CreateProjectDialogComponent>>;

  beforeEach(async(() => {
    projectServiceSpy = jasmine.createSpyObj('ProjectService', ['createProject']);
    projectServiceSpy.createProject.and.returnValue(Promise.resolve(mock));

    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    dialogRefSpy.close.and.returnValue();

    TestBed.configureTestingModule({
      declarations: [CreateProjectDialogComponent],
      imports: [ReactiveFormsModule, MatDialogModule, MatProgressSpinnerModule],
      providers: [
        { provide: ProjectService, useValue: projectServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProjectDialogComponent);
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
    component.createProjectForm.get('title').setValue('');
    fixture.detectChanges();
    const invalidState = component.createProjectForm.invalid;
    expect(invalidState).toBe(true);
  });

  it('should be valid when a title is entered', () => {
    component.createProjectForm.get('title').setValue('testtitle');
    fixture.detectChanges();
    const invalidState = component.createProjectForm.invalid;
    expect(invalidState).toBeFalse();
  });

  it('should create a prject through the project service', () => {
    component.createProjectForm.get('title').setValue('testtitle');
    fixture.detectChanges();
    component.submitForm(new Event('submit'));
    expect(projectServiceSpy.createProject).toHaveBeenCalled();
  });

  it('should close the dialog after creating a project', fakeAsync(() => {
    component.createProjectForm.get('title').setValue('testtitle');
    fixture.detectChanges();
    component.submitForm(new Event('submit')).then(() => {
      expect(dialogRefSpy.close).toHaveBeenCalled();
    });
  }));
});
