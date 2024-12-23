import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCompanyComponent } from './search-company.component';

describe('SearchCompanyComponent', () => {
  let component: SearchCompanyComponent;
  let fixture: ComponentFixture<SearchCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchCompanyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
