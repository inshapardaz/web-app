import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMeaningComponent } from './edit-meaning.component';

describe('EditMeaningComponent', () => {
  let component: EditMeaningComponent;
  let fixture: ComponentFixture<EditMeaningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMeaningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMeaningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
