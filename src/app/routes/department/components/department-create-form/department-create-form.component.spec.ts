import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentCreateFormComponent } from './department-create-form.component';

describe('DepartmentCreateFormComponent', () => {
  let component: DepartmentCreateFormComponent;
  let fixture: ComponentFixture<DepartmentCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentCreateFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DepartmentCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
