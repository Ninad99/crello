import { AuthState } from '../store/reducers/auth.reducer';
import { ThemeState } from '../store/reducers/theme.reducer';

export interface AppState {
  readonly auth: AuthState;
  readonly theme: ThemeState;
}
