import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewUserComponent } from './review-user.component';

describe('ReviewUserComponent', () => {
  let component: ReviewUserComponent;
  let fixture: ComponentFixture<ReviewUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReviewUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
