import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeMatchingListComponent } from './recipe-matching-list.component';

describe('RecipeMatchingListComponent', () => {
  let component: RecipeMatchingListComponent;
  let fixture: ComponentFixture<RecipeMatchingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipeMatchingListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeMatchingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
