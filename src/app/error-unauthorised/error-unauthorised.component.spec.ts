import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorUnauthorisedComponent } from './error-unauthorised.component';

describe('ErrorUnauthorisedComponent', () => {
  let component: ErrorUnauthorisedComponent;
  let fixture: ComponentFixture<ErrorUnauthorisedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorUnauthorisedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorUnauthorisedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
