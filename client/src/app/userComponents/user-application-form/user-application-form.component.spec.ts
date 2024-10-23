import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserApplicationFormComponent } from './user-application-form.component';

describe('UserApplicationFormComponent', () => {
  let component: UserApplicationFormComponent;
  let fixture: ComponentFixture<UserApplicationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserApplicationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserApplicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
