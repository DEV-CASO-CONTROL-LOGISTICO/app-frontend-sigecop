import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { forkJoin } from "rxjs";
import { RegexConstants } from "../../util/constant";
import { ObligacionResponse } from "../../model/api/response/ObligacionResponse";
import { ObligacionRequest } from "../../model/api/request/ObligacionRequest";
import { EstadoObligacionResponse } from "../../model/api/response/EstadoObligacionResponse";
import { ObligacionService } from "../../service/gestion/obligacion.service";
import { EstadoObligacionService } from "../../service/gestion/estadoObligacion.service";
import Swal from "sweetalert2";
import { calcularTotal, convertirIsoADDMMAAAA, handleError, setListRow } from "../../util/methods";
import { TipoObligacionService } from "../../service/master/tipoObligacion.service";
import { TipoObligacionResponse } from "../../model/api/response/TipoObligacionResponse";

@Component({
    selector: 'app-obligacion',
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
    templateUrl: './obligacion.component.html',
    styleUrl: './obligacion.component.css'
})

export class ObligacionComponent implements OnInit {
    public RG = RegexConstants;
    result: ObligacionResponse[] = [];
    filter: ObligacionRequest = {};
    record: ObligacionResponse = {};
    obligacionSelected: ObligacionResponse = {};
    columns: any[] = [];

    listEstados: EstadoObligacionResponse[] = [];
    listTipos: TipoObligacionResponse[] = [];

    @ViewChild('colAccionTemplate', { static: true }) colAccionTemplate!: TemplateRef<any>;
    @ViewChild('dialogTemplate', { static: true }) dialogTemplate!: TemplateRef<any>;
    @ViewChild('registrarTemplate', { static: true }) registrarTemplate!: TemplateRef<any>;
    @ViewChild('crearTemplate', { static: true }) crearTemplate!: TemplateRef<any>;
    @ViewChild('detalleObligacionTemplate', { static: true }) detalleObligacionTemplate!: TemplateRef<any>;
    dialogRef!: MatDialogRef<any>;
    
    constructor(
        private dialog: MatDialog,
        private service: ObligacionService,
        private estadoService: EstadoObligacionService,
        private tipoService: TipoObligacionService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadInitialData();
    }

    loadInitialData() {
        forkJoin({
            estados: this.estadoService.list({}),
            tipos: this.tipoService.list({}),
        }).subscribe({
            next: ({ estados, tipos}) => {
                this.listEstados = estados;
                this.listTipos = tipos;
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

    calcularMontoTotalPorProducto(cantidad: number | null | undefined, precioUnitario: number | null | undefined): number | null {
        return calcularTotal(cantidad, precioUnitario);
    }

    search() {
        this.service.list(this.filter).subscribe({
            next: (resultResponse) => {
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
        this.dialogRef = this.dialog.open(this.crearTemplate, { width: '800px' });
    }

    openRegistrar(item: ObligacionResponse) {
        this.service.find({ id: item.id }).subscribe({
            next: (resultResponse) => {
                this.record = {
                    ...resultResponse,
                    pedido: {
                        ...resultResponse.pedido,
                        pedidoProducto: (resultResponse.pedido?.pedidoProducto ?? []).map((pp, index) => ({
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
                    }
                };   
                this.dialogRef = this.dialog.open(this.registrarTemplate, { width: '800px' });
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

    openDetalleObligacion(item: ObligacionResponse) {
        this.obligacionSelected = {} as ObligacionResponse;

        forkJoin({
            resultResponse: this.service.find({ id: item.id })
        }).subscribe({
            next: ({ resultResponse }) => {
                this.obligacionSelected = {
                    ...resultResponse,
                    pedido: {
                        ...resultResponse.pedido,
                        pedidoProducto: (resultResponse.pedido?.pedidoProducto ?? []).map((pp, index) => ({
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
                    }
                };

                this.dialogRef = this.dialog.open(this.detalleObligacionTemplate, { width: '800px' });
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

    calcularTotalPagar(): number {
        const productos = this.record.pedido?.pedidoProducto ?? [];
        return productos.reduce((total, item) => {
            const cantidad = item.cantidad || 0;
            const monto = item.monto || 0;
            return total + cantidad * monto;
        }, 0);
    }


    registrarPago() {
        if (!this.record.descripcion) {
            Swal.fire({
                icon: 'warning',
                title: 'Faltan datos',
                text: 'Debe ingresar la descripción del pago',
            });
            return;
        }

        if (this.record.monto == null) {
            Swal.fire({
                icon: 'warning',
                title: 'Faltan datos',
                text: 'Debe ingresar el monto total a cancelar',
            });
            return;
        }

        const totalPagar = this.calcularTotalPagar();
        const totalCancelar = this.record.monto ?? 0;

        if (totalPagar !== totalCancelar) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `El monto a cancelar (S/ ${totalCancelar.toFixed(2)}) debe ser igual al total a pagar (S/ ${totalPagar.toFixed(2)}).`
            });
            return;
        }

        Swal.fire({
            title: 'Registrar Pago',
            text: `¿Está seguro de registrar el pago de la obligación ${this.record.codigo}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, registrar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.service.registrarPago({
                    id: this.record.id,
                    descripcion: this.record.descripcion,
                    monto: this.record.monto
                }).subscribe({
                    next: () => {
                        this.search();
                        Swal.fire('Éxito', 'Pago registrado correctamente', 'success');
                        this.dialogRef.close();
                    },
                    error: (err) => {
                        handleError(err);
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

        if (!this.record.monto || this.record.monto <= 0) {
            Swal.fire('Error', 'Ingrese un monto válido', 'error');
            return;
        }

        this.service.save(this.record).subscribe({
            next: (response) => {
                Swal.fire('Éxito', 'Obligación guardada correctamente', 'success');
                this.search();
                this.dialogRef.close();
            },
            error: (err) => {
                this.handleError(err);
            }
        });
    }

    delete(item: ObligacionResponse) {
        Swal.fire({
            title: 'Confirmar eliminación',
            text: `¿Está seguro de eliminar la obligación ${item.codigo}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.service.delete(item.id).subscribe({
                    next: () => {
                        Swal.fire('Éxito', 'Obligación eliminada', 'success');
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

    getEstadoDescripcion(estadoId?: number): string {
        const estado = estadoId ? this.listEstados.find(e => e.id === estadoId) : null;
        return estado?.descripcion ?? 'No especificado';
    }

    getTipoDescripcion(tipoId?: number): string {
        const tipo = tipoId ? this.listTipos.find(t => t.id === tipoId) : null;
        return tipo?.nombre ?? 'No especificado';
    }

    private initTable() {
        this.columns = [
            { name: 'Nro.', prop: 'row', width: 20 },
            { name: 'Código', prop: 'codigo', width: 50 },
            { name: 'Proveedor', prop: 'pedido.proveedor.razonSocial', width: 150},
            { name: 'Estado', prop: 'estado.descripcion', width: 120 },
            { name: 'Tipo', prop: 'tipo.nombre', width: 120 },
            { name: 'F. Registro', prop: 'fechaRegistro', pipe: { transform: (d: Date) => d ? new Date(d).toLocaleDateString() : '' }, width: 120 },
            { name: 'Acciones', cellTemplate: this.colAccionTemplate, width: 150 }
        ];
    }
}