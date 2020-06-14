import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { SnackService } from 'src/app/services/snack.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private afAuth: AngularFireAuth,
    private snack: SnackService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    const user = await this.afAuth.currentUser;
    const isLoggedIn = !!user;

    if (!isLoggedIn) {
      this.router.navigate(['/']);
      this.snack.authError();
    }

    return isLoggedIn;
  }
}
