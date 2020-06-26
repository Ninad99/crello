import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Project } from '../models/project.model';
import { Board } from '../models/board.model';
import { Task } from '../models/task.model';

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
      boards.push({
        id: boardId,
        ...board
      });
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
      tasks: []
    });

    const projectRef = this.db.collection('projects').doc(data.projectId).ref;
    const oldBoards = (await projectRef.get()).data().boards;
    const newBoards = [...oldBoards, boardRef.id];

    return this.db.collection('projects').doc(data.projectId).update({ boards: newBoards });
  }

  /**
   * Delete board
   */
  async deleteBoard(boardId: string, projectId?: string): Promise<void> {
    if (projectId) {
      const projectRef = this.db.collection<Project>('projects').doc(projectId).ref;
      await projectRef.update({
        boards: firebase.firestore.FieldValue.arrayRemove(boardId)
      });
    }

    return this.db.collection('boards').doc(boardId).delete();
  }

  /**
   * Update single board with task list
   */
  updateSingleBoardTasks(boardId: string, tasks: Task[]): Promise<void> {
    return this.db.collection<Board>('boards').doc(boardId).update({ tasks });
  }

  /**
   * Update tasks between multiple boards
   */
  async updateMultipleBoardTasks(
    prevBoardId: string,
    currBoardId: string,
    prevBoardData: Task[],
    currBoardData: Task[]
  ): Promise<void> {
    const prevBoardRef = this.db.collection<Board>('boards').doc(prevBoardId).ref;
    const currBoardRef = this.db.collection<Board>('boards').doc(currBoardId).ref;

    const db = firebase.firestore();
    const batch = db.batch();
    batch.update(prevBoardRef, { tasks: prevBoardData });
    batch.update(currBoardRef, { tasks: currBoardData });
    return batch.commit();
  }

  /**
   * Create a task
   */
  async createTask(task: Task, boardId: string): Promise<void> {
    const boardRef = this.db.collection<Board>('boards').doc(boardId).ref;

    return boardRef.update({
      tasks: firebase.firestore.FieldValue.arrayUnion(task)
    });
  }

  /**
   * Update a task
   */
  async updateTask(task: Task, boardId: string, index: number): Promise<void> {
    const boardRef = this.db.collection<Board>('boards').doc(boardId).ref;
    const boardData = (await boardRef.get()).data();

    const boardTasks = boardData.tasks;
    boardTasks[index] = task;

    return boardRef.update({
      tasks: boardTasks
    });
  }

  /**
   * Delete a task
   */
  deleteTask(boardId: string, task: Task): Promise<void> {
    return this.db
      .collection<Board>('boards')
      .doc(boardId)
      .update({
        tasks: firebase.firestore.FieldValue.arrayRemove(task)
      });
  }
}
