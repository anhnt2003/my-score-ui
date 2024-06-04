import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationPageListComponent } from './organization-page-list.component';

describe('OrganizationPageListComponent', () => {
  let component: OrganizationPageListComponent;
  let fixture: ComponentFixture<OrganizationPageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationPageListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrganizationPageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
