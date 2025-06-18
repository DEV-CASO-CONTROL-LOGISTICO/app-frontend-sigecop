import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenInternamientoComponent } from './orden-internamiento.component';

describe('OrdenInternamientoComponent', () => {
  let component: OrdenInternamientoComponent;
  let fixture: ComponentFixture<OrdenInternamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdenInternamientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdenInternamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
