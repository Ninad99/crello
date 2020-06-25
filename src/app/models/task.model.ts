export interface ChecklistItem {
  title: string;
  complete: boolean;
}

export interface Task {
  description?: string;
  label?: string;
  checklist?: ChecklistItem[];
  title: string;
}
