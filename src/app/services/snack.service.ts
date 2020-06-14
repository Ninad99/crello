import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SnackService {
  constructor(private snackBar: MatSnackBar, private router: Router) {}

  defaultSnackBarConfig: MatSnackBarConfig = {
    duration: 3000
  };

  openWithMessage(
    message: string,
    action?: string,
    config: MatSnackBarConfig = this.defaultSnackBarConfig
  ): void {
    this.snackBar.open(message, action, config);
  }

  authError(): Subscription {
    this.snackBar.open('You must be logged in!', 'OK', {
      duration: 5000
    });

    return (
      this.snackBar._openedSnackBarRef
        .onAction()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .pipe(tap(_ => this.router.navigate(['/', 'login'])))
        .subscribe()
    );
  }
}
