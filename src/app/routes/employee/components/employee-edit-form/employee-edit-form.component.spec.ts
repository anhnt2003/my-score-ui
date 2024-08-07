import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeEditFormComponent } from './employee-edit-form.component';

describe('EmployeeEditFormComponent', () => {
  let component: EmployeeEditFormComponent;
  let fixture: ComponentFixture<EmployeeEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeEditFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
