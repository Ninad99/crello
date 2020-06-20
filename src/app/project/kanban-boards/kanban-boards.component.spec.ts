import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanBoardsComponent } from './kanban-boards.component';

describe('KanbanBoardsComponent', () => {
  let component: KanbanBoardsComponent;
  let fixture: ComponentFixture<KanbanBoardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KanbanBoardsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KanbanBoardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
