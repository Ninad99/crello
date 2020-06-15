import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Project } from '../models/project.model';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) {}

  /**
   * Create a new project for the user
   */
  async createProject(title: string): Promise<DocumentReference> {
    const userId = (await this.afAuth.currentUser).uid;
    return this.db.collection('projects').add({
      uid: userId,
      title: title,
      boards: []
    });
  }

  /**
   * Get all projects for the current user
   */
  getUserProjects(): Observable<Project[]> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db
            .collection<Project>('projects', ref => ref.where('uid', '==', user.uid))
            .valueChanges({ idField: 'projectId' });
        } else {
          return [];
        }
      })
    );
  }

  /**
   * Get a specific project from the project id and user id
   */
  getProject(id: string): Observable<Project | null> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db
            .collection<Project>('projects', ref => ref.where('uid', '==', user.uid))
            .doc(id)
            .valueChanges();
        } else {
          return null;
        }
      })
    );
  }
}
