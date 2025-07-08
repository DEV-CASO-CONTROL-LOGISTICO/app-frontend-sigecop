import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObligacionAsistenteContableComponent } from './obligacion-asistente-contable.component';

describe('ObligacionAsistenteContableComponent', () => {
  let component: ObligacionAsistenteContableComponent;
  let fixture: ComponentFixture<ObligacionAsistenteContableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObligacionAsistenteContableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObligacionAsistenteContableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
