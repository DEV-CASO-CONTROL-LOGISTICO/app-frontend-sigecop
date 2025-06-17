import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonModule } from '@angular/common';
import { calcularTotal, convertirIsoADDMMAAAA, setListRow } from '../../util/methods';
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
import { EstadoSolicitudResponse } from '../../model/api/response/EstadoSolicitudResponse';
import { Proveedor } from '../../model/dto/Proveedor';
import { SolicitudProductoRequest } from '../../model/api/request/SolicitudProductoRequest';
import { ProveedorService } from '../../service/master/proveedor.service';
import { ProductoService } from '../../service/master/producto.service';
import { RegexConstants } from '../../util/constant';
import { CotizacionResponse } from '../../model/api/response/CotizacionResponse';
import { CotizacionService } from '../../service/gestion/cotizacion.service';




@Component({
    selector: 'app-solicitud',
    imports: [CommonModule,
        NgxDatatableModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatDatepickerModule,
        FormsModule],
    templateUrl: './solicitud.component.html',
    styleUrl: './solicitud.component.css'
})
export class SolicitudComponent implements OnInit {
    public RG = RegexConstants;

    solicitudFinalizadoSelect?: Boolean;
    solicitudIdSelect?: number;
    result: SolicitudResponse[] = [];
    solicitudSelected: SolicitudResponse = {};
    cotizacionSelected: CotizacionResponse = {};
    filter: SolicitudRequest = {};
    record: SolicitudRequest = {};
    columns: any[] = [];
    columnsCotizacion: any[] = [];

    listEstados: EstadoSolicitudResponse[] = [];
    listProveedores: Proveedor[] = [];
    listProductos: ProductoResponse[] = [];
    selectedProductos: SolicitudProductoRequest[] = [];
    selectedProveedores: number[] = [];
    listCotizaciones: CotizacionResponse[] = [];

    @ViewChild('colAccionTemplate', { static: true }) colAccionTemplate!: TemplateRef<any>;
    @ViewChild('dialogTemplate', { static: true }) dialogTemplate!: TemplateRef<any>;
    @ViewChild('viewCotizacionTemplate', { static: true }) viewCotizacionTemplate!: TemplateRef<any>;
    @ViewChild('viewDetalleCotizacionTemplate', { static: true }) viewDetalleCotizacionTemplate!: TemplateRef<any>;
    dialogRef!: MatDialogRef<any>;
    dialogRefAux!: MatDialogRef<any>;

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
            proveedores: this.proveedorService.list({}),
            productos: this.productoService.list({})
        }).subscribe({
            next: ({ estados, proveedores, productos }) => {
                this.listEstados = estados;
                this.listProveedores = proveedores;
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

    private handleError(err: any) {
        const errorMessage = err?.error?.message || err?.error || 'Ocurrió un error inesperado';
        Swal.fire('Error', errorMessage, 'error');
    }

    convertirFecha(fecha: any): any {
        return convertirIsoADDMMAAAA(fecha);
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

    openAdd() {
        this.record = {};
        this.selectedProductos = [];
        this.selectedProveedores = [];
        this.dialogRef = this.dialog.open(this.dialogTemplate, { width: '800px' });
    }

    openEdit(item: SolicitudResponse) {
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
                    solicitudProducto: (resultResponse.solicitudProducto ?? []).map(sp => {
                        return {
                            id: sp.id,
                            cantidad: sp.cantidad,
                            productoId: sp.producto?.id,
                            productoNombre: sp.producto?.nombre
                        }
                    }),
                };
                // Cargar proveedores seleccionados
                this.selectedProveedores = this.record.proveedores ?? [];

                // Cargar productos seleccionados (eliminando duplicados)
                this.selectedProductos = this.record.solicitudProducto?.map(sp => ({
                    id: sp.id,
                    productoId: sp.productoId,
                    cantidad: sp.cantidad,
                    productoNombre: sp.productoNombre // Agregamos el nombre para mostrar
                })) || [];
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

    searchCotizaciones(solicitudId: any) {
        forkJoin({
            resultResponse: this.cotizacionService.list({ solicitudId: solicitudId })
        }).subscribe({
            next: ({ resultResponse }) => {
                this.listCotizaciones = [...setListRow(resultResponse ?? [])];
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


    openViewCotizaciones(item: SolicitudResponse) {
        this.solicitudIdSelect = item.id;
        this.solicitudFinalizadoSelect = item.finalizado;
        this.solicitudSelected = item;
        this.searchCotizaciones(item.id);
        this.dialogRef = this.dialog.open(this.viewCotizacionTemplate, {
            width: '1000px',
            maxWidth: 'none'
        });
    }

    calcularMontoTotalPorProducto(cantidad: number | null | undefined, precioUnitario: number | null | undefined): number | null {
        return calcularTotal(cantidad, precioUnitario);
    }

    calcularSubtotal(): number {
        const total = this.cotizacionSelected.monto ?? 0;
        return total / 1.18;
    }

    verDetalleCotizacion(item: CotizacionResponse) {
        forkJoin({
            resultCotizacion: this.cotizacionService.find({ id: item.id })
        }).subscribe({
            next: ({ resultCotizacion }) => {
                this.cotizacionSelected = resultCotizacion;
                this.cotizacionSelected.cotizacionProducto = setListRow(this.cotizacionSelected.cotizacionProducto ?? []);
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
        this.dialogRefAux = this.dialog.open(this.viewDetalleCotizacionTemplate, {
            width: '850px',
            maxWidth: 'none'
        });
    }

    archivarCotizacion(item: CotizacionResponse) {
        Swal.fire({
            title: 'Confirmar archivar',
            text: `¿Está seguro de archivar la cotización ${item.codigo}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, archivar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.cotizacionService.archivar({ id: item.id }).subscribe({
                    next: () => {
                        Swal.fire('Éxito', 'Cotización archivada', 'success');
                        this.searchCotizaciones(this.solicitudIdSelect);
                        this.cdr.detectChanges();
                    },
                    error: (err) => {
                        this.handleError(err);
                    }
                });
            }
        });
    }

    aprobarCotizacion(item: CotizacionResponse) {
        Swal.fire({
            title: 'Confirmar aprobar',
            text: `¿Está seguro de aprobar la cotización ${item.codigo}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, aprobar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.cotizacionService.aprobar({ id: item.id }).subscribe({
                    next: () => {
                        Swal.fire('Éxito', 'Cotización aprobada', 'success');
                        this.searchCotizaciones(this.solicitudIdSelect);
                        this.search();
                        this.cdr.detectChanges();
                    },
                    error: (err) => {
                        this.handleError(err);
                    }
                });
            }
        });
    }

    save() {
        if (!this.record.descripcion?.trim()) {
            Swal.fire('Error', 'Complete todos los campos obligatorios', 'error');
            return;
        }

        if (this.record.descripcion?.length > 500) {
            Swal.fire('Error', 'La descripción no puede exceder los 500 caracteres', 'error');
            return;
        }

        if (this.selectedProveedores.length === 0) {
            Swal.fire('Error', 'Seleccione al menos un proveedor', 'error');
            return;
        }

        if (this.selectedProductos.length === 0) {
            Swal.fire('Error', 'Agregue al menos un producto', 'error');
            return;
        }

        const productoSelectInvalido = this.selectedProductos.some(p =>
            !p.productoId
        );
        const productoCantInvalido = this.selectedProductos.some(p =>
            !p.cantidad || p.cantidad <= 0
        );
        if (productoSelectInvalido) {
            Swal.fire('Error', 'Todos los productos deben tener una cantidad válida', 'error');
            return;
        }
        if (productoCantInvalido) {
            Swal.fire('Error', 'Todos los productos deben tener una cantidad válida', 'error');
            return;
        }

        this.record.proveedores = this.selectedProveedores;
        this.record.solicitudProducto = this.selectedProductos;

        this.service.save(this.record).subscribe({
            next: (response) => {
                Swal.fire('Éxito', 'Solicitud guardada correctamente', 'success');
                this.search();
                this.dialogRef.close();
            },
            error: (err) => {
                this.handleError(err);
            }
        });
    }


    delete(item: SolicitudResponse) {
        Swal.fire({
            title: 'Confirmar eliminación',
            text: `¿Está seguro de eliminar la solicitud ${item.codigo}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.service.delete(item.id).subscribe({
                    next: () => {
                        Swal.fire('Éxito', 'Solicitud eliminada', 'success');
                        this.search();
                        this.cdr.detectChanges();
                    },
                    error: (err) => {
                        this.handleError(err);
                    }
                });
            }
        });
    }

    finalizar(item: SolicitudResponse) {
        Swal.fire({
            title: 'Confirmar finalización',
            text: `¿Está seguro de finalizar la solicitud ${item.codigo}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, finalizar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.service.finalizar({ id: item.id }).subscribe({
                    next: () => {
                        Swal.fire('Éxito', 'Solicitud finalizada', 'success');
                        this.search();
                        this.cdr.detectChanges();
                    },
                    error: (err) => {
                        this.handleError(err);
                    }
                });
            }
        });
    }

    getFilteredProductos(index: number): ProductoResponse[] {
        const currentProductId = this.selectedProductos[index]?.productoId;

        return this.listProductos.filter(p =>
            p.id === currentProductId ||
            !this.selectedProductos.some(sp => sp.productoId === p.id)
        );
    }


    addProducto() {
        const productosDisponibles = this.getAvailableProducts();
        if (productosDisponibles.length === 0) {
            Swal.fire('Atención', 'Ya no hay más productos disponibles para agregar.', 'info');
            return;
        }
        this.selectedProductos.push({
            productoId: null, //productosDisponibles[0].id
            cantidad: 1
        });
    }

    private getAvailableProducts(): ProductoResponse[] {
        return this.listProductos.filter(p =>
            !this.selectedProductos.some(sp => sp.productoId === p.id)
        );
    }

    removeProducto(index: number) {
        this.selectedProductos.splice(index, 1);
    }

    getEstadoDescripcion(estadoId?: number): string {
        const estado = estadoId ? this.listEstados.find(e => e.id === estadoId) : null;
        return estado?.descripcion ?? 'En proceso';
    }

    private initTable() {
        this.columns = [
            { name: 'Nro.', prop: 'row', width: 50 },
            { name: 'Código', prop: 'codigo', width: 100 },
            { name: 'Descripción', prop: 'descripcion' },
            { name: 'Estado', prop: 'estado.descripcion', width: 120 },
            { name: 'F. Creación', prop: 'fechaCreacion', pipe: { transform: (d: Date) => d ? new Date(d).toLocaleDateString() : '' }, width: 120 },
            { name: 'F. Finalizado', prop: 'fechaFinalizado', pipe: { transform: (d: Date) => d ? new Date(d).toLocaleDateString() : '' }, width: 120 },
            { name: 'Acciones', cellTemplate: this.colAccionTemplate, width: 120 }
        ];
    }


}
