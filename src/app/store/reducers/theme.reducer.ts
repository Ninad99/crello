import { ThemeAction, ThemeActionTypes } from '../actions/theme.actions';

export interface ThemeState {
  isDarkTheme: boolean;
}

const initialThemeState: ThemeState = {
  isDarkTheme: false
};

export function ThemeReducer(
  state: ThemeState = initialThemeState,
  action: ThemeAction
): ThemeState {
  switch (action.type) {
    case ThemeActionTypes.TOGGLE_THEME:
      return {
        isDarkTheme: !state.isDarkTheme
      };

    default:
      return state;
  }
}
