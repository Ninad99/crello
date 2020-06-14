import { AuthAction, AuthActionTypes } from '../actions/auth.actions';

export interface AuthState {
  loading: boolean;
  error: firebase.auth.Error | null;
  isLoggedIn: boolean;
}

const initialAuthState: AuthState = {
  loading: false,
  error: null,
  isLoggedIn: false
};

export function AuthReducer(state: AuthState = initialAuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case AuthActionTypes.RESET_AUTH:
      return initialAuthState;

    case AuthActionTypes.LOGIN_START:
      return {
        ...state,
        loading: true
      };

    case AuthActionTypes.LOGIN_SUCCESS:
      return {
        loading: false,
        error: null,
        isLoggedIn: true
      };

    case AuthActionTypes.LOGIN_FAILURE:
      return {
        loading: false,
        error: action.payload,
        isLoggedIn: false
      };

    default:
      return state;
  }
}
