import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SweetCard } from './sweet-card';

describe('SweetCard', () => {
  let component: SweetCard;
  let fixture: ComponentFixture<SweetCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SweetCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SweetCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
