import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Store } from '@ngrx/store';
import { AppState } from './models/appstate.model';
import { LoginSuccess } from './store/actions/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loading: boolean;

  constructor(private afAuth: AngularFireAuth, private store: Store<AppState>) {
    this.loading = true;
  }

  ngOnInit(): void {
    this.afAuth.onAuthStateChanged((user: firebase.User) => {
      if (user) {
        this.store.dispatch(new LoginSuccess());
        this.loading = false;
      } else {
        this.loading = false;
      }
    });
  }
}
