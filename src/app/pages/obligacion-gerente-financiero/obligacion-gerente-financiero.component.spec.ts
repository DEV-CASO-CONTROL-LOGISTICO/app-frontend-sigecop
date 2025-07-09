import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObligacionGerenteFinancieroComponent } from './obligacion-gerente-financiero.component';

describe('ObligacionGerenteFinancieroComponent', () => {
  let component: ObligacionGerenteFinancieroComponent;
  let fixture: ComponentFixture<ObligacionGerenteFinancieroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObligacionGerenteFinancieroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObligacionGerenteFinancieroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
