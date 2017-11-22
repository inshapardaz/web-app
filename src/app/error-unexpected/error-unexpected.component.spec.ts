import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorUnexpectedComponent } from './error-unexpected.component';

describe('ErrorUnexpectedComponent', () => {
  let component: ErrorUnexpectedComponent;
  let fixture: ComponentFixture<ErrorUnexpectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorUnexpectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorUnexpectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
