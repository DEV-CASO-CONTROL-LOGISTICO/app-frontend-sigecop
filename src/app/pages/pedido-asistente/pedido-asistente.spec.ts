import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PedidoAsistenteComponent } from './pedido-asistente';


describe('PedidoAsistenteComponent', () => {
  let component: PedidoAsistenteComponent;
  let fixture: ComponentFixture<PedidoAsistenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidoAsistenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidoAsistenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
