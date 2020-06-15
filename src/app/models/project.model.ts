import { Board } from './board.model';

export interface Project {
  uid?: string;
  title?: string;
  boards?: Board[];
  projectId?: string;
}
