import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonModule } from '@angular/common';
import { setListRow } from '../../util/methods';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { PedidoResponse } from '../../model/api/response/PedidoResponse';
import { ProductoResponse } from '../../model/api/response/ProductoResponse';
import { EstadoPedidoResponse } from '../../model/api/response/EstadoPedidoResponse';
import { ProductoService } from '../../service/master/producto.service';
import { RegexConstants } from '../../util/constant';
import { PedidoRequest } from '../../model/api/request/PedidoRequest';
import { PedidoService } from '../../service/gestion/pedido.service';
import { EstadoPedidoService } from '../../service/gestion/estadoPedido.service';
import { PedidoProductoResponse } from '../../model/api/response/PedidoProductoResponse';

@Component({
    selector: 'app-pedido-proveedor',
    standalone: true,
    imports: [
        CommonModule,
        NgxDatatableModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatDatepickerModule,
        FormsModule
    ],
    templateUrl: './pedido-proveedor.component.html',
    styleUrl: './pedido-proveedor.component.css'
})
export class PedidoProveedorComponent implements OnInit {
    public RG = RegexConstants;
    pedidoIdSelect?: number;
    result: PedidoResponse[] = [];
    filter: PedidoRequest = {};
    record: PedidoResponse = {};
    columns: any[] = [];
    listEstados: EstadoPedidoResponse[] = [];
    listProductos: ProductoResponse[] = [];
    observacionEnvio: string = '';

    @ViewChild('colAccionTemplate', { static: true }) colAccionTemplate!: TemplateRef<any>;
    @ViewChild('detallePedidoTemplate', { static: true }) detallePedidoTemplate!: TemplateRef<any>;
    dialogRef!: MatDialogRef<any>;

    constructor(
        private dialog: MatDialog,
        private service: PedidoService,
        private estadoService: EstadoPedidoService,
        private productoService: ProductoService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadInitialData();
    }

    loadInitialData() {
        forkJoin({
            estados: this.estadoService.list({}),
            productos: this.productoService.list({})
        }).subscribe({
            next: ({ estados, productos }) => {
                this.listEstados = estados;
                this.listProductos = productos;
                this.search();
            },
            error: (err) => {
                Swal.fire('Error', 'No se pudo cargar datos iniciales', 'error');
            }
        });
    }

    cleanSearch() {
        this.filter = {};
        this.search();
    }

    search() {
        forkJoin({
            resultResponse: this.service.findByProveedor(this.filter)
        }).subscribe({
            next: ({ resultResponse }) => {
                this.result = [...setListRow(resultResponse)].filter(pedido => 
                    pedido.estado?.descripcion !== 'GENERADO' && 
                    pedido.estado?.descripcion !== 'DEVUELTO' &&
                    pedido.estado?.descripcion !== 'CON CONFORMIDAD'
                );
                this.initTable();
            },
            error: (err) => {
                Swal.close();
                Swal.fire({
                    icon: 'warning',
                    title: '¡Advertencia!',
                    text: err.error,
                });
            }
        });
    }

    openDetallePedido(pedido: PedidoResponse) {
        this.record = {} as PedidoResponse;
        this.observacionEnvio = pedido.observacionEnvio || '';

        forkJoin({
            resultResponse: this.service.find({ id: pedido.id })
        }).subscribe({
            next: ({ resultResponse }) => {
                this.record = {
                    ...resultResponse,
                    pedidoProducto: (resultResponse.pedidoProducto ?? []).map(pp => ({
                        id: pp.id,
                        cantidad: pp.cantidad,                        
                        producto: {
                            id: pp.producto?.id,
                            nombre: pp.producto?.nombre,
                            codigo: pp.producto?.id,
                            precioUnitario: pp.producto?.precioUnitario
                        }
                    }))
                };
                
                this.observacionEnvio = resultResponse.observacionEnvio || '';
            },
            error: (err) => {
                Swal.fire('Error', 'No se pudo cargar el detalle del pedido', 'error');
            }
        });

        this.dialogRef = this.dialog.open(this.detallePedidoTemplate, {
            width: '800px'
        });
    }

    calcularSubTotal(producto: PedidoProductoResponse): number {
        const cantidad = producto.cantidad ?? 0;
        const precio = producto.producto?.precioUnitario ?? 0;
        return (cantidad * precio);
    }

    calcularTotal(pedido: PedidoResponse): number {
        if (!pedido.pedidoProducto?.length) return 0;
        
        return pedido.pedidoProducto.reduce((total, producto) => {
            return total + this.calcularSubTotal(producto);
        }, 0);
    }

    validarTotal(pedido: PedidoResponse): { 
        totalCalculado: number; 
        totalBackend: number; 
        coincide: boolean; 
        diferencia: number 
    } {
        const totalCalculado = this.calcularTotal(pedido);
        const totalBackend = pedido.montoTotal || 0;
        
        const diferencia = Math.abs(totalCalculado - totalBackend);
        const coincide = diferencia < 0.01;
        
        return {
            totalCalculado,
            totalBackend,
            coincide,
            diferencia
        };
    }

    private initTable() {
        this.columns = [
            { name: 'Nro.', prop: 'row', width: 50 },
            { name: 'Código', prop: 'codigo', width: 70 },
            { name: 'Estado', prop: 'estado.descripcion', width: 100 },  
            { name: 'Proveedor', prop: 'proveedor.razonSocial', width: 150 },
            { name: 'Descripción', prop: 'descripcion', width: 120 },
            { name: 'Monto Total', prop: 'montoTotal', pipe: { transform: (m: number) => `S/ ${m?.toFixed(2) || '0.00'}` }, width: 100 },
            { name: 'F. Registro', prop: 'fechaRegistro', pipe: { transform: (d: Date) => d ? new Date(d).toLocaleDateString() : '' }, width: 100 },
            { name: 'Acciones', cellTemplate: this.colAccionTemplate, width: 120 }
        ];
    }
}
