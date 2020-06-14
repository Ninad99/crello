import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/models/appstate.model';
import { LoginStart } from 'src/app/store/actions/auth.actions';
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

    const email = this.email.value;
    const password = this.password.value;

    try {
      if (this.isLogin) {
        this.store.dispatch(new LoginStart({ email: email, password: password }));
        // await this.afAuth.signInWithEmailAndPassword(email, password);
      }
      if (this.isSignup) {
        await this.afAuth.createUserWithEmailAndPassword(email, password);
      }
      if (this.isPasswordReset) {
        await this.afAuth.sendPasswordResetEmail(email);
        this.serverMessage = 'Check your email';
      }
    } catch (err) {
      this.serverMessage = err;
    }
  }
}
