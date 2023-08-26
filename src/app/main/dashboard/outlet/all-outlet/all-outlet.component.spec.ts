import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllOutletComponent } from './all-outlet.component';

describe('AllOutletComponent', () => {
  let component: AllOutletComponent;
  let fixture: ComponentFixture<AllOutletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllOutletComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
