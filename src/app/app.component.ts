import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class AppComponent implements OnInit, OnDestroy {
  loading: boolean;
  _redirectSubscription: Subscription;
  redirectUrl: string;

  constructor(
    private afAuth: AngularFireAuth,
    private store: Store<AppState>,
    private router: Router
  ) {
    this.loading = true;
  }

  ngOnInit(): void {
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
        if (this.redirectUrl) this.router.navigate([this.redirectUrl]);
        this.loading = false;
      } else {
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this._redirectSubscription) this._redirectSubscription.unsubscribe();
  }
}
