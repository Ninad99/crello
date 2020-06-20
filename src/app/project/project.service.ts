import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Project } from '../models/project.model';
import { Board } from '../models/board.model';

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

  /**
   * Delete a project
   */
  async deleteProject(projectId: string): Promise<boolean> {
    const user = await this.afAuth.currentUser;
    const projectRef = this.db.collection('projects').doc(projectId).ref;
    const projectData = (await projectRef.get()).data() as Project;

    if (projectData.uid === user.uid) {
      const boards = projectData.boards as string[];

      if (boards?.length > 0) {
        boards.forEach(async boardId => {
          await this.deleteBoard(boardId);
        });
      }

      await projectRef.delete();
      return Promise.resolve(true);
    }

    return Promise.resolve(false);
  }

  /**
   * Get all boards of current project
   */
  async getProjectBoards(boardIds: string[]): Promise<Board[]> {
    const boards: Board[] = [];

    for (const boardId of boardIds) {
      const board = (await this.db.collection<Board>('boards').doc(boardId).ref.get()).data();
      boards.push(board);
    }

    return Promise.resolve(boards);
  }

  /**
   * Creates a new board for the current user
   */
  async createBoard(data: { order: number; title: string; projectId: string }): Promise<void> {
    const user = await this.afAuth.currentUser;

    const boardRef = await this.db.collection('boards').add({
      ...data,
      uid: user.uid,
      tasks: [{ description: 'Hello!', label: 'Yellow' }]
    });

    const projectRef = this.db.collection('projects').doc(data.projectId).ref;
    const oldBoards = (await projectRef.get()).data().boards;
    const newBoards = [...oldBoards, boardRef.id];

    return this.db.collection('projects').doc(data.projectId).update({ boards: newBoards });
  }

  /**
   * Delete board
   */
  deleteBoard(boardId: string): Promise<void> {
    return this.db.collection('boards').doc(boardId).delete();
  }
}
