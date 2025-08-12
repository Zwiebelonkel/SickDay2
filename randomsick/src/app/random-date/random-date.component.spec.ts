import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomDateComponent } from './random-date.component';

describe('RandomDateComponent', () => {
  let component: RandomDateComponent;
  let fixture: ComponentFixture<RandomDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RandomDateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RandomDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
