import { TestBed, async } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ProjectService } from './project.service';

describe('ProjectService', () => {
  let service: ProjectService;
  const afAuthStub = {};
  const db = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFireAuth, useValue: afAuthStub },
        { provide: AngularFirestore, useValue: db }
      ]
    });
    service = TestBed.get(ProjectService);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
