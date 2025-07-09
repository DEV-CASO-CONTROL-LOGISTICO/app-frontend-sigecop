import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObligacionGerenteGeneralComponent } from './obligacion-gerente-general.component';

describe('ObligacionGerenteGeneralComponent', () => {
  let component: ObligacionGerenteGeneralComponent;
  let fixture: ComponentFixture<ObligacionGerenteGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObligacionGerenteGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObligacionGerenteGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
