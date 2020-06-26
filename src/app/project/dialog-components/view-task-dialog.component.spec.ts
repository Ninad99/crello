import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTaskDialogComponent } from './view-task-dialog.component';

describe('ViewTaskDialogComponent', () => {
  let component: ViewTaskDialogComponent;
  let fixture: ComponentFixture<ViewTaskDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewTaskDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
