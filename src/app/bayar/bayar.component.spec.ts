import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BayarComponent } from './bayar.component';

describe('BayarComponent', () => {
  let component: BayarComponent;
  let fixture: ComponentFixture<BayarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BayarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BayarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
