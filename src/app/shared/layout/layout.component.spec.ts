import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { LayoutComponent } from './layout.component';
import { BreakpointObserver, LayoutModule, BreakpointState } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../user/auth.service';
import { Store } from '@ngrx/store';
import { OverlayContainer } from '@angular/cdk/overlay';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, Observable, from } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let el: DebugElement;

  let storeSelectStub: Observable<unknown>;

  const mockAuthServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['signOut']);

  const matchObj = [
    // initially all are false
    { matchStr: '(min-width: 1024px)', result: false },
    { matchStr: '(min-width: 1366px)', result: false },
    { matchStr: '(max-width: 1366px)', result: false }
  ];
  const fakeObserve = (s: string[]): Observable<BreakpointState> =>
    from(matchObj).pipe(
      filter(match => match.matchStr === s[0]),
      map(match => <BreakpointState>{ matches: match.result, breakpoints: {} })
    );
  const mockBreakpointObserverSpy = jasmine.createSpyObj<BreakpointObserver>('BreakpointObserver', [
    'observe'
  ]);
  mockBreakpointObserverSpy.observe.and.callFake(fakeObserve);

  const mockStoreSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']);
  mockStoreSpy.select.and.returnValue(of(storeSelectStub));

  const htmlElementStub = document.createElement('div');
  const mockOverlayContainerSpy = jasmine.createSpyObj<OverlayContainer>('OverlayContainer', [
    'getContainerElement'
  ]);
  mockOverlayContainerSpy.getContainerElement.and.returnValue(htmlElementStub);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LayoutComponent],
      imports: [
        LayoutModule,
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        MatIconModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: BreakpointObserver, useValue: mockBreakpointObserverSpy },
        { provide: AuthService, useValue: mockAuthServiceSpy },
        { provide: Store, useValue: mockStoreSpy },
        { provide: OverlayContainer, useValue: mockOverlayContainerSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should contain a <mat-toolbar> with the title '📋 Crello'`, () => {
    const toolbar = el.query(By.css('mat-toolbar')).nativeElement;
    expect(toolbar.innerHTML).toContain('📋 Crello');
  });

  it('should dispatch an action to the store on toggling the theme', () => {
    component.toggleTheme();
    expect(mockStoreSpy.dispatch).toHaveBeenCalled();
  });

  it('should signout via the auth service on logout', () => {
    component.logout();
    expect(mockAuthServiceSpy.signOut).toHaveBeenCalled();
  });

  it(`should have 'darkTheme' class applied on toggling the value from store`, () => {
    component.isDarkTheme$ = of(true);
    fixture.detectChanges();
    const layout = el.query(By.css('main')).nativeElement;
    const classes = layout.classList;
    expect(classes.length).toBeGreaterThan(0);
    expect(classes[0]).toBe('darkTheme');
  });

  it(`should have 4 links in the nav-list when logged in`, () => {
    component.isLoggedIn$ = of(true);
    component.isHandset$ = of(true);
    fixture.detectChanges();

    const navList = el.query(By.css('mat-nav-list')).nativeElement as HTMLElement;
    const links = navList.children;
    expect(links.length).toBe(4);
  });
});
