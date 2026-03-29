import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WsuggestionPage } from './wsuggestion.page';

describe('WsuggestionPage', () => {
  let component: WsuggestionPage;
  let fixture: ComponentFixture<WsuggestionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WsuggestionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
