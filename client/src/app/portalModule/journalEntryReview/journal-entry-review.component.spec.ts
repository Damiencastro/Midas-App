import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalEntryReviewComponent } from './journal-entry-review.component';

describe('JournalEntryReviewComponent', () => {
  let component: JournalEntryReviewComponent;
  let fixture: ComponentFixture<JournalEntryReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JournalEntryReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalEntryReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
