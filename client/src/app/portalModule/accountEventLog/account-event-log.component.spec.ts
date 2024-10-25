import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountEventLogComponent } from './account-event-log.component';

describe('AccountEventLogComponent', () => {
  let component: AccountEventLogComponent;
  let fixture: ComponentFixture<AccountEventLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountEventLogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountEventLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
