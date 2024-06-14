import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { HasAuthGuard } from './has-auth.guard';

describe('hasAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => HasAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
