import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBusinessGLEditComponent } from './admin-business-gledit.component';

describe('AdminBusinessGLEditComponent', () => {
  let component: AdminBusinessGLEditComponent;
  let fixture: ComponentFixture<AdminBusinessGLEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminBusinessGLEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBusinessGLEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
