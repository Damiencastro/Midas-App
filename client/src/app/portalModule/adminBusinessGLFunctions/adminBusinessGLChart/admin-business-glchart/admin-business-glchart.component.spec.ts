import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBusinessGLChartComponent } from './admin-business-glchart.component';

describe('AdminBusinessGLChartComponent', () => {
  let component: AdminBusinessGLChartComponent;
  let fixture: ComponentFixture<AdminBusinessGLChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminBusinessGLChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBusinessGLChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
