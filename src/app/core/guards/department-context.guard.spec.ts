import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { departmentContextGuard } from './department-context.guard';

describe('departmentContextGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => departmentContextGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
