import { Task } from './task.model';

export interface Board {
  id?: string;
  title?: string;
  priority?: number;
  tasks?: Task[];
  projectId?: string;
}
