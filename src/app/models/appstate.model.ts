import { AuthState } from '../store/reducers/auth.reducer';

export interface AppState {
  readonly auth: AuthState;
}
