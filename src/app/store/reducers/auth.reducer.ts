import { AuthAction, AuthActionTypes } from '../actions/auth.actions';

export interface AuthState {
  loading: boolean;
  error: firebase.auth.Error | null;
  isLoggedIn: boolean;
  redirectUrl: string;
}

const initialAuthState: AuthState = {
  loading: false,
  error: null,
  isLoggedIn: false,
  redirectUrl: ''
};

export function AuthReducer(state: AuthState = initialAuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case AuthActionTypes.RESET_AUTH:
      return initialAuthState;

    case AuthActionTypes.SET_REDIRECT_URL:
      return {
        ...state,
        redirectUrl: action.payload
      };

    case AuthActionTypes.LOGIN_START:
      return {
        ...state,
        loading: true
      };

    case AuthActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        isLoggedIn: true
      };

    case AuthActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isLoggedIn: false
      };

    default:
      return state;
  }
}
