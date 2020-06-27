import { Component, OnInit, OnDestroy, NgZone, AfterViewInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Store } from '@ngrx/store';
import { AppState } from './models/appstate.model';
import { LoginSuccess } from './store/actions/auth.actions';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  loading: boolean;
  _redirectSubscription: Subscription;
  redirectUrl: string;

  constructor(
    private afAuth: AngularFireAuth,
    private store: Store<AppState>,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.loading = true;
  }

  async ngOnInit(): Promise<void> {
    this._redirectSubscription = this.store
      .select(state => state.auth.redirectUrl)
      .subscribe((url: string) => {
        if (url) {
          this.redirectUrl = url;
        }
      });
    this.afAuth.onAuthStateChanged((user: firebase.User) => {
      if (user) {
        this.store.dispatch(new LoginSuccess());
        if (this.redirectUrl) this.ngZone.run(() => this.router.navigate([this.redirectUrl]));
      }
    });
  }

  ngOnDestroy(): void {
    if (this._redirectSubscription) this._redirectSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.setLoading(false), 1000);
  }

  setLoading(value: boolean): void {
    this.loading = value;
  }
}
