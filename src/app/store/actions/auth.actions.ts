import { Action } from '@ngrx/store';

export enum AuthActionTypes {
  LOGIN_START = '[AUTH] Login start',
  LOGIN_SUCCESS = '[AUTH] Login success',
  LOGIN_FAILURE = '[AUTH] Login failure',
  RESET_AUTH = '[AUTH] Reset auth',
  SET_REDIRECT_URL = '[AUTH] Set redirect url'
}

export class LoginStart implements Action {
  readonly type = AuthActionTypes.LOGIN_START;
  constructor(public payload: { email: string; password: string }) {}
}

export class LoginSuccess implements Action {
  readonly type = AuthActionTypes.LOGIN_SUCCESS;
}

export class LoginFailure implements Action {
  readonly type = AuthActionTypes.LOGIN_FAILURE;
  constructor(public payload: firebase.auth.Error) {}
}

export class ResetAuth implements Action {
  readonly type = AuthActionTypes.RESET_AUTH;
}

export class SetRedirectUrl implements Action {
  readonly type = AuthActionTypes.SET_REDIRECT_URL;
  constructor(public payload: string) {}
}

export type AuthAction = LoginStart | LoginSuccess | LoginFailure | ResetAuth | SetRedirectUrl;
