import { GoogleSigninDirective } from './google-signin.directive';
import { AngularFireAuth } from '@angular/fire/auth';

describe('GoogleSigninDirective', () => {
  const afAuthStub = jasmine.createSpyObj<AngularFireAuth>('AngularFireAuth', ['signInWithPopup']);

  it('should create an instance', () => {
    const directive = new GoogleSigninDirective(afAuthStub);
    expect(directive).toBeTruthy();
  });
});
