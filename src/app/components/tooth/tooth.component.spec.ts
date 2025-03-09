import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToothComponent } from './tooth.component';

describe('ToothComponent', () => {
  let component: ToothComponent;
  let fixture: ComponentFixture<ToothComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToothComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToothComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
