import { GoogleSigninDirective } from './google-signin.directive';
import { AngularFireAuth } from '@angular/fire/auth';

let mock: AngularFireAuth;

describe('GoogleSigninDirective', () => {
  it('should create an instance', () => {
    const directive = new GoogleSigninDirective(mock);
    expect(directive).toBeTruthy();
  });
});
