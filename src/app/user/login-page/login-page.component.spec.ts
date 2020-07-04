import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { AuthService } from '../auth.service';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { LoginPageComponent } from './login-page.component';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let el: DebugElement;
  const mockAuthService = {};
  let mockStore: jasmine.SpyObj<Store>;

  beforeEach(async(() => {
    mockStore = jasmine.createSpyObj<Store>('Store', ['select']);
    mockStore.select.and.returnValue(of(false));
    TestBed.configureTestingModule({
      declarations: [LoginPageComponent],
      imports: [MatButtonModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Store, useValue: mockStore }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should contain a 'Login With Google' button`, () => {
    const button = el.query(By.css('.google-login')).nativeElement;
    expect(button.innerText).toContain('Login with Google');
  });

  it(`should show 'Successfully logged in' after logging in`, () => {
    component.isLoggedIn$ = of(true);
    fixture.detectChanges();
    const p = el.query(By.css('.row > p')).nativeElement;
    expect(p.innerText).toContain('Successfully logged in');
  });

  it(`should contain a 'Open Projects List' button when logged in`, () => {
    component.isLoggedIn$ = of(true);
    fixture.detectChanges();
    const button = el.query(By.css('.open-projects')).nativeElement;
    expect(button.innerText).toContain('Open Project List');
  });
});
