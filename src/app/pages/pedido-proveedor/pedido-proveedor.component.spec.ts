import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoProveedorComponent } from './pedido-proveedor.component';

describe('PedidoProveedorComponent', () => {
  let component: PedidoProveedorComponent;
  let fixture: ComponentFixture<PedidoProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidoProveedorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidoProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
