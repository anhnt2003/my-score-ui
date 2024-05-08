import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardUserListComponent } from './dashboard-user-list.component';

describe('DashboardUserListComponent', () => {
  let component: DashboardUserListComponent;
  let fixture: ComponentFixture<DashboardUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardUserListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
