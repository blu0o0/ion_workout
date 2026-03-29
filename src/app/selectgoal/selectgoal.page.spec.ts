import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectgoalPage } from './selectgoal.page';

describe('SelectgoalPage', () => {
  let component: SelectgoalPage;
  let fixture: ComponentFixture<SelectgoalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectgoalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
