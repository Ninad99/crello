import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailLoginComponent } from './email-login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('EmailLoginComponent', () => {
  let component: EmailLoginComponent;
  let fixture: ComponentFixture<EmailLoginComponent>;
  let el: DebugElement;

  let afAuthSpy: jasmine.SpyObj<AngularFireAuth>;
  let storeSpy: jasmine.SpyObj<Store>;

  beforeEach(async(() => {
    afAuthSpy = jasmine.createSpyObj('AngularFireAuth', ['fetchSignInMethodsForEmail']);
    afAuthSpy.fetchSignInMethodsForEmail.and.returnValue(Promise.resolve(['password']));

    storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    storeSpy.select.and.returnValue(of(false));

    TestBed.configureTestingModule({
      declarations: [EmailLoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AngularFireAuth, useValue: afAuthSpy },
        { provide: Store, useValue: storeSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form state for empty input fields', () => {
    component.formType = 'login';
    component.form.get('email').setValue('');
    component.form.get('password').setValue('');

    expect(component.form.invalid).toBe(true);
  });

  it('should have an valid form state for valid input fields', () => {
    component.formType = 'login';
    component.form.get('email').setValue('hello@hello.com');
    component.form.get('password').setValue('hellotest');

    expect(component.form.invalid).toBeFalse();
  });

  it('should have a disabled submit button for non matching password fields', () => {
    component.formType = 'signup';
    component.form.get('email').setValue('hello@hello.com');
    component.form.get('password').setValue('hellotest');
    component.form.get('passwordConfirm').setValue('hellotestss');

    fixture.detectChanges();

    const submitButton = el.query(By.css('#submit-button')).nativeElement as HTMLButtonElement;

    expect(submitButton.disabled).toBe(true);
  });

  it('should dispatch an action to the store on login', () => {
    component.formType = 'login';
    component.form.get('email').setValue('hello@hello.com');
    component.form.get('password').setValue('hellotest');
    component.onSubmit(new Event('submit'));

    expect(storeSpy.dispatch).toHaveBeenCalled();
  });
});
