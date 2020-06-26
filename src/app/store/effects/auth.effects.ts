import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { AuthService } from '../../user/auth.service';
import {
  AuthActionTypes,
  LoginStart,
  LoginSuccess,
  LoginFailure,
  SignupStart,
  SignupSuccess,
  SignupFailure
} from '../actions/auth.actions';
import { of } from 'rxjs';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private authService: AuthService) {}

  @Effect()
  loginUser$ = this.actions$.pipe(
    ofType<LoginStart>(AuthActionTypes.LOGIN_START),
    mergeMap(data =>
      this.authService.signIn(data.payload.email, data.payload.password).pipe(
        map(() => new LoginSuccess()),
        catchError((err: firebase.auth.Error) => of(new LoginFailure(err)))
      )
    )
  );

  @Effect()
  signupUser$ = this.actions$.pipe(
    ofType<SignupStart>(AuthActionTypes.SIGN_UP_START),
    mergeMap(data =>
      this.authService.signUp(data.payload.email, data.payload.password).pipe(
        map(() => new SignupSuccess()),
        catchError((err: firebase.auth.Error) => of(new SignupFailure(err)))
      )
    )
  );
}
