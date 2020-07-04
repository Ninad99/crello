import { TestBed, async } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const afAuthStub = {};
  const storeStub = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: AngularFireAuth, useValue: afAuthStub },
        { provide: Store, useValue: storeStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
