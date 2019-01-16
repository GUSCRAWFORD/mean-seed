import { TestBed } from '@angular/core/testing';

import { MainNavMenuService } from './main-nav-menu.service';

describe('MainNavMenuService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MainNavMenuService = TestBed.get(MainNavMenuService);
    expect(service).toBeTruthy();
  });
});
