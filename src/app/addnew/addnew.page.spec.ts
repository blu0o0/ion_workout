import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddnewPage } from './addnew.page';

describe('AddnewPage', () => {
  let component: AddnewPage;
  let fixture: ComponentFixture<AddnewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddnewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
