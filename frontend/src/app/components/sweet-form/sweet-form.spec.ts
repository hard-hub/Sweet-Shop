import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SweetForm } from './sweet-form';

describe('SweetForm', () => {
  let component: SweetForm;
  let fixture: ComponentFixture<SweetForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SweetForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SweetForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
