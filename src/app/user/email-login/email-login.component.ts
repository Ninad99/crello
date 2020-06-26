import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/models/appstate.model';
import { LoginStart, SignupStart } from 'src/app/store/actions/auth.actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-email-login',
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.scss']
})
export class EmailLoginComponent implements OnInit {
  form: FormGroup;

  formType: string;
  loading$: Observable<boolean>;
  error$: Observable<firebase.auth.Error>;

  serverMessage: string;

  constructor(
    private afAuth: AngularFireAuth,
    private fb: FormBuilder,
    private store: Store<AppState>
  ) {
    this.formType = 'signup';
  }

  ngOnInit(): void {
    this.loading$ = this.store.select(state => state.auth.loading);
    this.error$ = this.store.select(state => state.auth.error);
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6), Validators.required]],
      passwordConfirm: ['', []]
    });
  }

  changeType(type: 'login' | 'signup' | 'reset'): void {
    this.formType = type;
  }

  get isLogin(): boolean {
    return this.formType === 'login';
  }

  get isSignup(): boolean {
    return this.formType === 'signup';
  }

  get isPasswordReset(): boolean {
    return this.formType === 'reset';
  }

  get email(): AbstractControl {
    return this.form.get('email');
  }

  get password(): AbstractControl {
    return this.form.get('password');
  }

  get passwordConfirm(): AbstractControl {
    return this.form.get('passwordConfirm');
  }

  get passwordDoesMatch(): boolean {
    if (this.formType !== 'signup') return true;
    else return this.password.value === this.passwordConfirm.value;
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.serverMessage = '';

    const email = this.email.value;
    const password = this.password.value;

    if (this.isLogin) {
      this.store.dispatch(new LoginStart({ email: email, password: password }));
    }
    if (this.isSignup) {
      this.store.dispatch(new SignupStart({ email: email, password: password }));
    }
    if (this.isPasswordReset) {
      try {
        const loginMethods = await this.afAuth.fetchSignInMethodsForEmail(email);
        if (loginMethods.includes('password')) {
          await this.afAuth.sendPasswordResetEmail(email);
          this.serverMessage = 'A password reset link has been sent to your email.';
        } else {
          throw new Error(
            'There is no account associated with this email. Try signing in with a different authentication provider or signing up.'
          );
        }
      } catch (err) {
        this.serverMessage = err;
      }
    }
  }
}
