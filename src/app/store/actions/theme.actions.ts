import { Action } from '@ngrx/store';

export enum ThemeActionTypes {
  TOGGLE_THEME = '[THEME] Toggle Theme'
}

export class ToggleThemeAction implements Action {
  readonly type = ThemeActionTypes.TOGGLE_THEME;
}

export type ThemeAction = ToggleThemeAction;
