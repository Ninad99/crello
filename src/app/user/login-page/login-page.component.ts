import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/models/appstate.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;

  constructor(public authService: AuthService, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.store.select(state => state.auth.isLoggedIn);
  }

  signOut(): void {
    this.authService.signOut();
  }
}
