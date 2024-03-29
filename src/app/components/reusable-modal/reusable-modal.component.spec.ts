import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableModalComponent } from './reusable-modal.component';

describe('ReusableModalComponent', () => {
  let component: ReusableModalComponent;
  let fixture: ComponentFixture<ReusableModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReusableModalComponent]
    });
    fixture = TestBed.createComponent(ReusableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
