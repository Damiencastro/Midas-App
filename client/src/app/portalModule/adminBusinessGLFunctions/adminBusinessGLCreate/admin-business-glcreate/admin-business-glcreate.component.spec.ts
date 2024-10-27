import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBusinessGLCreateComponent } from './admin-business-glcreate.component';

describe('AdminBusinessGLCreateComponent', () => {
  let component: AdminBusinessGLCreateComponent;
  let fixture: ComponentFixture<AdminBusinessGLCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminBusinessGLCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBusinessGLCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
