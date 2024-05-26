import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationPageCreateComponent } from './organization-page-create.component';

describe('OrganizationPageCreateComponent', () => {
  let component: OrganizationPageCreateComponent;
  let fixture: ComponentFixture<OrganizationPageCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationPageCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrganizationPageCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
