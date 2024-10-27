import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBusinessGLDeactivateComponent } from './admin-business-gldeactivate.component';

describe('AdminBusinessGLDeactivateComponent', () => {
  let component: AdminBusinessGLDeactivateComponent;
  let fixture: ComponentFixture<AdminBusinessGLDeactivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminBusinessGLDeactivateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBusinessGLDeactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
