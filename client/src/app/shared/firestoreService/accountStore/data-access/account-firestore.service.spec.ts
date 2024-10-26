import { TestBed } from '@angular/core/testing';

import { AccountFirestoreService } from './account-firestore.service';

describe('AccountFirestoreService', () => {
  let service: AccountFirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountFirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
