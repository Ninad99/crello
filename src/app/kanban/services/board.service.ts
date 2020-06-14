import { Injectable } from '@angular/core';
import { firestore } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Board } from '../../models/board.model';
import { Task } from '../../models/task.model';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) {}

  /**
   * Creates a new board for the current user
   */
  async createBoard(data: Board): Promise<DocumentReference> {
    const user = await this.afAuth.currentUser;
    return this.db.collection('boards').add({
      ...data,
      uid: user.uid,
      tasks: [{ description: 'Hello!', label: 'Yellow' }]
    });
  }

  /**
   * Delete board
   */
  deleteBoard(boardId: string): Promise<void> {
    return this.db.collection('boards').doc(boardId).delete();
  }

  /**
   * Updates the tasks on board
   */
  updateTasks(boardId: string, tasks: Task[]): Promise<void> {
    return this.db.collection('boards').doc(boardId).update({ tasks });
  }

  /**
   * Remove a specific task from the board
   */
  removeTask(boardId: string, task: Task): Promise<void> {
    return this.db
      .collection('boards')
      .doc(boardId)
      .update({
        tasks: firestore.FieldValue.arrayRemove(task)
      });
  }

  /**
   * Get all boards owned by current user
   */
  getUserBoards(): Observable<Board[]> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db
            .collection<Board>('boards', ref =>
              ref.where('uid', '==', user.uid).orderBy('priority')
            )
            .valueChanges({ idField: 'id' });
        } else {
          return [];
        }
      })
    );
  }

  /**
   *
   * Run a batch write to change the priority of each board for sorting
   */
  sortBoards(boards: Board[]): void {
    const db = firestore();
    const batch = db.batch();
    const refs = boards.map(b => db.collection('boards').doc(b.id));
    refs.forEach((ref, idx) => batch.update(ref, { priority: idx }));
    batch.commit();
  }
}
