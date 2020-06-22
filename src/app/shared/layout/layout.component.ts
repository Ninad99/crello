import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../user/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../models/appstate.model';
import { ToggleThemeAction } from '../../store/actions/theme.actions';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
  isHandset$: Observable<boolean>;
  isLoggedIn$: Observable<boolean>;
  isDarkTheme$: Observable<boolean>;

  _switcher: Subscription;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private store: Store<AppState>,
    private overlayContainer: OverlayContainer
  ) {}

  ngOnInit(): void {
    this.isHandset$ = this.breakpointObserver.observe([Breakpoints.Handset]).pipe(
      map(result => result.matches),
      shareReplay()
    );
    this.isLoggedIn$ = this.store.select(state => state.auth.isLoggedIn);
    this.isDarkTheme$ = this.store.select(state => state.theme.isDarkTheme);

    this._switcher = this.isDarkTheme$.subscribe((isDark: boolean) => {
      if (isDark) {
        this.overlayContainer.getContainerElement().classList.add('darkTheme');
      } else {
        this.overlayContainer.getContainerElement().classList.remove('darkTheme');
      }
    });
  }

  ngOnDestroy(): void {
    if (this._switcher) this._switcher.unsubscribe();
  }

  toggleTheme(): void {
    this.store.dispatch(new ToggleThemeAction());
  }

  logout(): void {
    this.authService.signOut();
  }
}
