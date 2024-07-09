import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeScoreReviewFormComponent } from './employee-score-review-form.component';

describe('EmployeeScoreReviewFormComponent', () => {
  let component: EmployeeScoreReviewFormComponent;
  let fixture: ComponentFixture<EmployeeScoreReviewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeScoreReviewFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeScoreReviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
