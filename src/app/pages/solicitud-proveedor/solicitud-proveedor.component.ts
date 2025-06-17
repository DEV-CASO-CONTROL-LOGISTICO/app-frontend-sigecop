import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
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
import { SolicitudResponse } from '../../model/api/response/SolicitudResponse';
import { SolicitudRequest } from '../../model/api/request/SolicitudRequest';
import { SolicitudService } from '../../service/gestion/solicitud.service';
import { EstadoSolicitudService } from '../../service/gestion/estadoSolicitud.service';
import { ProductoResponse } from '../../model/api/response/ProductoResponse';
import { Proveedor } from '../../model/dto/Proveedor';
import { SolicitudProductoRequest } from '../../model/api/request/SolicitudProductoRequest';
import { ProveedorService } from '../../service/master/proveedor.service';
import { ProductoService } from '../../service/master/producto.service';
import { RegexConstants } from '../../util/constant';
import { CotizacionResponse } from '../../model/api/response/CotizacionResponse';
import { CotizacionService } from '../../service/gestion/cotizacion.service';
import { StorageService } from '../../service/util/storage.service';
import { UsuarioService } from '../../service/security/usuario.service';
import { EstadoSolicitudResponse } from '../../model/api/response/EstadoSolicitudResponse';
import { CotizacionRequest } from '../../model/api/request/CotizacionRequest';
import { CotizacionProductoRequest } from '../../model/api/request/CotizacionProductoRequest';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-solicitud-proveedor',
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
    templateUrl: './solicitud-proveedor.component.html',
    styleUrl: './solicitud-proveedor.component.css'
})
export class SolicitudProveedorComponent {
    public RG = RegexConstants;

    solicitudFinalizadoSelect?: Boolean;
    solicitudIdSelect?: number;
    result: SolicitudResponse[] = [];
    filter: SolicitudRequest = {};
    record: SolicitudRequest = {};
    cotizacionRecord: CotizacionRequest = {};
    columns: any[] = [];

    listEstados: EstadoSolicitudResponse[] = [];

    @ViewChild('colEstadoTemplate', { static: true }) colEstadoTemplate!: TemplateRef<any>;
    @ViewChild('colAccionTemplate', { static: true }) colAccionTemplate!: TemplateRef<any>;
    @ViewChild('dialogTemplate', { static: true }) dialogTemplate!: TemplateRef<any>;
    @ViewChild('dialogTemplateCotizacion', { static: true }) dialogTemplateCotizacion!: TemplateRef<any>;
    @ViewChild('colAccionTemplateIconSend', { static: true }) colAccionTemplateIconSend!: TemplateRef<any>;

    @ViewChild('viewCotizacionTemplate', { static: true }) viewCotizacionTemplate!: TemplateRef<any>;
    dialogRef!: MatDialogRef<any>;

    constructor(
        private dialog: MatDialog,
        private service: SolicitudService,
        private estadoService: EstadoSolicitudService,
        private proveedorService: ProveedorService,
        private productoService: ProductoService,
        private cotizacionService: CotizacionService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadInitialData();
    }

    loadInitialData() {
        forkJoin({
            estados: this.estadoService.list({}),
            productos: this.productoService.list({}),
        }).subscribe({
            next: ({ estados, productos }) => {
                this.listEstados = estados;
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
            resultResponse: this.service.findByProveedor({
                estadoId: this.filter.estadoId,
                codigo: this.filter.codigo,
                descripcion: this.filter.descripcion
            })
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

    openView(item: SolicitudResponse) {
        this.record = {};
        forkJoin({
            resultResponse: this.service.find({ id: item.id })
        }).subscribe({
            next: ({ resultResponse }) => {
                this.record = {
                    id: resultResponse.id,
                    codigo: resultResponse.codigo,
                    descripcion: resultResponse.descripcion,
                    fechaCreacion: resultResponse.fechaCreacion,
                    estadoId: resultResponse.estado?.id,
                    estadoStr: resultResponse.estado?.descripcion,
                    proveedores: (resultResponse.proveedores ?? []).map(prov => prov.id ?? 0),
                    solicitudProducto: setListRow((resultResponse.solicitudProducto ?? []).map(sp => {
                        return {
                            row: 0,
                            id: sp.id,
                            cantidad: sp.cantidad,
                            productoId: sp.producto?.id,
                            productoNombre: sp.producto?.nombre
                        }
                    })),
                };
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


        this.dialogRef = this.dialog.open(this.dialogTemplate, { width: '800px' });
    }

    validarCantidad(event: any) {
        const input = event.target;
        const valor = input.value;

        const regex = /^\d{0,4}(\.\d{0,2})?$/;

        if (!regex.test(valor)) {
            const limpio = valor.match(/^\d{0,4}(\.\d{0,2})?/);
            input.value = limpio ? limpio[0] : '';
            input.dispatchEvent(new Event('input')); // Actualiza ngModel
        }
    }

    openSendCotizacion(item: SolicitudResponse) {
        this.cotizacionRecord = {};
        const observables: any = {
            resultResponse: this.service.find({ id: item.id })
        };
        if (item.cotizacionActual?.id) {
            observables.resultCotizacion = this.cotizacionService.find({ id: item.cotizacionActual.id });
        }
        forkJoin(observables).subscribe({
            next: (res: any) => {
                const resultResponse: SolicitudResponse = res.resultResponse;
                const resultCotizacion: CotizacionResponse = res.resultCotizacion ?? null;
                this.cotizacionRecord = {
                    id: item.cotizacionActual?.id,
                    comentario: item.cotizacionActual?.comentario,
                    solicitud: {
                        id: resultResponse.id,
                        codigo: resultResponse.codigo,
                        descripcion: resultResponse.descripcion,
                        fechaCreacion: resultResponse.fechaCreacion,
                        estadoId: resultResponse.estado?.id,
                        estadoStr: resultResponse.estado?.descripcion,
                    },
                    solicitudProveedorId: item.solicitudProveedorActualId,
                    cotizacionProducto: setListRow(resultCotizacion && resultCotizacion.id ? // si tiene cotizacion
                        (resultCotizacion.cotizacionProducto ?? []).map(sp => {
                            return {
                                row: 0,
                                cantidadSolicitada: sp.cantidadSolicitado,
                                cantidadCotizada: sp.cantidadCotizada,
                                precioUnitario: sp.precioUnitario,
                                productoId: sp.producto?.id,
                                productoNombre: sp.producto?.nombre
                            }
                        }) :
                        (resultResponse.solicitudProducto ?? []).map(sp => {
                            return {
                                row: 0,
                                cantidadSolicitada: sp.cantidad,
                                cantidadCotizada: sp.cantidad,
                                precioUnitario: null,
                                productoId: sp.producto?.id,
                                productoNombre: sp.producto?.nombre
                            }
                        })
                    ),
                };
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

        this.dialogRef = this.dialog.open(this.dialogTemplateCotizacion, {
            width: '850px',
            maxWidth: 'none'
        });
    }

    calcularTotal(): number {
        return (this.cotizacionRecord?.cotizacionProducto ?? [])
            .reduce((total, row: CotizacionProductoRequest) => {
                const cantidad = parseFloat(row.cantidadCotizada + '') || 0;
                const precio = parseFloat(row.precioUnitario + '') || 0;
                return total + cantidad * precio;
            }, 0);
    }

    calcularSubtotal(): number {
        const total = this.calcularTotal();
        return total / 1.18;
    }

    sendCotizacion() {
        const productosSelectPrice = this.cotizacionRecord?.cotizacionProducto?.some(p =>
            !p.precioUnitario
        );
        if (productosSelectPrice) {
            Swal.fire('Error', 'Todos los productos deben tener un precio unitario', 'error');
            return;
        }

        this.cotizacionRecord.monto = this.calcularTotal();

        Swal.fire({
            title: this.cotizacionRecord.id ? "Actualización de Cotización" : "Envío de Cotización",
            text: "¿Está seguro de " + (this.cotizacionRecord.id ? "actualizar" : "enviar") + " su cotización?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.cotizacionService.save(this.cotizacionRecord).subscribe({
                    next: (response) => {
                        Swal.fire('Éxito', 'Cotización enviada correctamente', 'success');
                        this.search();
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
            { name: 'Código', prop: 'codigo', width: 100 },
            { name: 'Descripción', prop: 'descripcion' },
            { name: 'Estado', prop: 'estado.descripcion', width: 120 },
            { name: 'F. Creación', prop: 'fechaCreacion', pipe: { transform: (d: Date) => d ? new Date(d).toLocaleDateString() : '' }, width: 120 },
            { name: 'F. Finalizado', prop: 'fechaFinalizado', pipe: { transform: (d: Date) => d ? new Date(d).toLocaleDateString() : '' }, width: 120 },
            { name: '¿Cotización enviada?', cellTemplate: this.colAccionTemplateIconSend, width: 120 },
            { name: 'Acciones', cellTemplate: this.colAccionTemplate, width: 120 }
        ];
    }
}
