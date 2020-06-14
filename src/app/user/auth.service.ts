import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../models/appstate.model';
import { ResetAuth } from '../store/actions/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$: Observable<firebase.User>;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.currentUser$ = this.afAuth.authState;
  }

  signIn(email: string, password: string): Observable<firebase.auth.UserCredential> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password));
  }

  signOut(): void {
    this.afAuth.signOut();
    this.store.dispatch(new ResetAuth());
    this.router.navigate(['/']);
  }
}
