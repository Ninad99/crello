import { Pipe, PipeTransform } from '@angular/core';
import { ChecklistItem } from '../models/task.model';

@Pipe({
  name: 'countComplete'
})
export class CountCompletePipe implements PipeTransform {
  transform(checklistItems: ChecklistItem[]): string {
    if (checklistItems.length === 0) return '';

    let completedCount = 0;

    for (const item of checklistItems) {
      if (item.complete) completedCount += 1;
    }

    return `${completedCount}/${checklistItems.length}`;
  }
}
