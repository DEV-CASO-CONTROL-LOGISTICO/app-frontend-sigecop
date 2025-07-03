import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonModule } from '@angular/common';
import { calcularTotal, convertirIsoADDMMAAAA, handleError, setListRow } from '../../util/methods';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { PedidoResponse } from '../../model/api/response/PedidoResponse';
import { ProductoResponse } from '../../model/api/response/ProductoResponse';
import { EstadoPedidoResponse } from '../../model/api/response/EstadoPedidoResponse';
import { ProductoService } from '../../service/master/producto.service';
import { RegexConstants } from '../../util/constant';
import { PedidoRequest } from '../../model/api/request/PedidoRequest';
import { PedidoService } from '../../service/gestion/pedido.service';
import { EstadoPedidoService } from '../../service/gestion/estadoPedido.service';
import { PedidoProductoRequest } from '../../model/api/request/PedidoProductoRequest';
import { url } from 'node:inspector';

@Component({
    selector: 'app-pedido',
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
        FormsModule,
        MatIconModule
    ],
    templateUrl: './pedido-asistente.component.html',
    styleUrl: './pedido-asistente.component.css'
})
export class PedidoAsistenteComponent implements OnInit {
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
    @ViewChild('devolverTemplate', { static: true }) devolverTemplate!: TemplateRef<any>;
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
            resultResponse: this.service.list(this.filter)
        }).subscribe({
            next: ({ resultResponse }) => {
                this.result = [...setListRow(resultResponse)];
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

    convertirFecha(fecha: any): any {
        return convertirIsoADDMMAAAA(fecha);
    }

    calcularMontoTotalPorProducto(cantidad: number | null | undefined, precioUnitario: number | null | undefined): number | null {
        return calcularTotal(cantidad, precioUnitario);
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
                    pedidoProducto: (resultResponse.pedidoProducto ?? []).map((pp, index) => ({
                        row: index + 1,
                        id: pp.id,
                        producto: {
                            id: pp.producto?.id,
                            nombre: pp.producto?.nombre,
                            precioUnitario: pp.producto?.precioUnitario
                        },
                        cantidad: pp.cantidad,
                        monto: pp.monto
                    }))
                };

                this.observacionEnvio = resultResponse.observacionEnvio || '';
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

        this.dialogRef = this.dialog.open(this.detallePedidoTemplate, { width: '800px' });
    }

    validarCantidad(event: any) {
        const input = event.target;
        const valor = input.value;

        const regex = /^\d{0,4}(\.\d{0,2})?$/;

        if (!regex.test(valor)) {
            const limpio = valor.match(/^\d{0,4}(\.\d{0,2})?/);
            input.value = limpio ? limpio[0] : '';
            input.dispatchEvent(new Event('input'));
        }
    }

    calcularSubTotal(): number {
        const total = this.calcularTotal();
        return parseFloat((total / 1.18).toFixed(2));
    }

    calcularTotal(): number {
        return (this.record?.pedidoProducto ?? [])
            .reduce((total, row: PedidoProductoRequest) => {
                const cantidad = parseFloat(row.cantidad + '') || 0;
                const precio = parseFloat(row.monto + '') || 0;
                return total + cantidad * precio;
            }, 0);
    }

    verFactura(pedidoId: number) {
        this.service.verFactura(pedidoId).subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        
        window.open(url, '_blank');
        window.URL.revokeObjectURL(url);
        console.log('URL de la solicitud:', url);
        }, error => {
            Swal.fire('Error', 'No se pudo cargar la factura', 'error');
        });        
    }

    verGuia(pedidoId: number) {
        this.service.verGuia(pedidoId).subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        window.URL.revokeObjectURL(url);
        }, error => {
            Swal.fire('Error', 'No se pudo cargar la guía', 'error');
        });
    }

    darConformidad(item: PedidoResponse) {
        Swal.fire({
            title: 'Dar Conformidad',
            text: `¿Está seguro de dar conformidad al pedido ${item.codigo}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.service.darConformidad({ id: item.id }).subscribe({
                    next: () => {
                        Swal.fire('Éxito', 'Pedido conforme', 'success');
                        this.search();
                        this.cdr.detectChanges();
                    },
                    error: (err) => {
                        handleError(err);
                    }
                });
            }
        });
    }

    openDevolver(item: PedidoResponse) {
        this.record = item;
        this.record.observacionEnvio = "";
        this.dialogRef = this.dialog.open(this.devolverTemplate, { width: '800px' });
    }

    devolver() {
        if (!this.record.observacionEnvio) {
            Swal.fire({
                icon: 'warning',
                title: 'Debe ingresar la observación encontrada',
            });
            return;
        }
        Swal.fire({
            title: 'Devolver Pedido',
            text: `¿Está seguro de devolver el pedido ${this.record.codigo}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.service.devolver(
                    { id: this.record.id, observacionEnvio: this.record.observacionEnvio }
                ).subscribe({
                    next: () => {
                        this.search();
                        Swal.close();
                        Swal.fire('Éxito', 'Pedido Devuelto', 'success');
                        this.cdr.detectChanges();
                        this.dialogRef.close();
                    },
                    error: (err) => {
                        handleError(err);
                    }
                });
            }
        });
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
