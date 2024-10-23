import { TestBed } from '@angular/core/testing';

import { UserLinkingServicesService } from './user-linking-services.service';

describe('UserLinkingServicesService', () => {
  let service: UserLinkingServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserLinkingServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
