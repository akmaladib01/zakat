import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentComponent } from './payment-process.component';

describe('PaymentProcessComponent', () => {
  let component: PaymentComponent;
  let fixture: ComponentFixture<PaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
