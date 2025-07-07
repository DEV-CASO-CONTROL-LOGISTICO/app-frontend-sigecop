import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObligacionComponent} from './obligacion.component';


describe('PedidoAsistenteComponent', () => {
  let component: ObligacionComponent;
  let fixture: ComponentFixture<ObligacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObligacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObligacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
