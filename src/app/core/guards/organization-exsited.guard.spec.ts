import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { organizationExsitedGuard } from './organization-exsited.guard';

describe('organizationExsitedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => organizationExsitedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
