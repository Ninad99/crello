export interface Task {
  description?: string;
  type?: string;
  color?: 'purple' | 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  label?: 'purple' | 'blue' | 'green' | 'yellow' | 'red' | 'gray';
  labels: string[];
  title: string;
}
