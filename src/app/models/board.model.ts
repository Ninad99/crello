import { Task } from './task.model';

export interface Board {
  id?: string;
  title?: string;
  order?: number;
  tasks?: Task[];
  projectId?: string;
  uid?: string;
}
