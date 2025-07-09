import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormGroup, FormsModule } from "@angular/forms";
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
    @ViewChild('enviarTemplate', { static: true }) enviarTemplate!: TemplateRef<any>;
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

                this.result = resultResponse.map((item, index) => {
                    const proveedor = item.pedido?.proveedor?.razonSocial;
                    const usuarioPago = item.nombreUsuarioPago;

                    return {
                        ...item,
                        row: index + 1,
                        proveedor_o_usuario: proveedor ?? usuarioPago
                    };
                });

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
        this.record = {
            descripcion: '',
            monto: 0,
            tipo: {},
            estado: { id: 2 },
            esPendiente: true
        };
        this.dialogRef = this.dialog.open(this.crearTemplate, { width: '800px' });
    }


    save() {
        // Validar descripción
        const descripcion = this.record.descripcion?.trim();
        if (!descripcion) {
            Swal.fire('Error', 'La descripción es obligatoria', 'error');
            return;
        }

        if (descripcion.length > 500) {
            Swal.fire('Error', 'La descripción no puede exceder los 500 caracteres', 'error');
            return;
        }

        // Validar monto
        if (this.record.monto == null || this.record.monto <= 0) {
            Swal.fire('Error', 'Debe ingresar un monto válido mayor a 0', 'error');
            return;
        }

        // Validar tipo de obligación
        if (!this.record.tipo?.id) {
            Swal.fire('Error', 'Seleccione un tipo de obligación', 'error');
            return;
        }

        // Validar cuenta bancaria
        if (!this.record.cuentaBancariaTemporal?.trim()) {
            Swal.fire('Error', 'Debe ingresar una cuenta bancaria', 'error');
            return;
        }

        // Validar nombre de usuario a pagar
        if (!this.record.nombreUsuarioPago?.trim()) {
            Swal.fire('Error', 'Debe ingresar el nombre de la persona a pagar', 'error');
            return;
        }

        const payload: ObligacionRequest = {
            ...this.record,
            id: undefined,
            tipoId: this.record.tipo.id,
            estadoId: 3,
        };

        this.service.save(payload).subscribe({
            next: () => {
                Swal.fire('Éxito', 'Obligación registrada correctamente', 'success');
                this.search();
                this.dialogRef.close();
            },
            error: (err) => this.handleError(err)
        });
    }



    openEnviar(item: ObligacionResponse) {
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
                this.dialogRef = this.dialog.open(this.enviarTemplate, { width: '800px' });
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
        const tienePedido = item.pedido && Array.isArray(item.pedido.pedidoProducto);

        if (tienePedido) {
            const productos = item.pedido!.pedidoProducto!.map((pp, index) => ({
            row: index + 1,
            id: pp.id,
            producto: {
                id: pp.producto?.id,
                nombre: pp.producto?.nombre,
                precioUnitario: pp.producto?.precioUnitario
            },
            cantidad: pp.cantidad,
            monto: pp.monto
            }));

            this.obligacionSelected = {
            ...item,
            pedido: {
                ...item.pedido!,
                pedidoProducto: productos
            }
            };
        } else {
            this.obligacionSelected = { ...item };
        }

        console.log('Productos cargados:', this.obligacionSelected.pedido?.pedidoProducto);
        this.dialogRef = this.dialog.open(this.detalleObligacionTemplate, { width: '800px' });        
    }



    calcularTotalPagar(): number {
        const productos = this.record.pedido?.pedidoProducto ?? [];
        return productos.reduce((total, item) => {
            const cantidad = item.cantidad || 0;
            const monto = item.monto || 0;
            return total + cantidad * monto;
        }, 0);
    }


    enviarPago(item: ObligacionResponse) {
        if (!this.record.descripcion?.trim()) {
            Swal.fire('Campos incompletos', 'Debe ingresar la descripción', 'warning');
            return;
        }

        if (!this.record.cuentaBancariaTemporal?.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Faltan datos',
                text: 'Debe ingresar la cuenta bancaria',
            });
            return;
        }

        Swal.fire({
            title: 'Registrar Pago',
            text: `¿Está seguro de registrar el pago de la obligación ${item.codigo}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, registrar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {        
                item.estado = { id: 3, descripcion: 'Enviado por aprobacion' };

                this.service.changeStatus({ id: item.id, estadoId: 3 }).subscribe({
                    next: () => {
                        Swal.fire('Éxito', 'Obligación registrada', 'success');
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

    openRechazar(item: ObligacionResponse) {
        Swal.fire({
            title: 'Confirmar Rechazar Obligación',
            text: `¿Está seguro de rechazar la obligación ${item.codigo}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, rechazar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {        
                item.estado = { id: 7, descripcion: 'Observado por documentos' };

                this.service.changeStatus({ id: item.id, estadoId: 7 }).subscribe({
                    next: () => {
                        Swal.fire('Éxito', 'Obligación rechazada', 'success');
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
            { name: 'Proveedor/Usuario a Pagar', prop: 'proveedor_o_usuario', width: 150, cellClass: 'text-break'},
            { name: 'Estado', prop: 'estado.descripcion', width: 120 },
            { name: 'Tipo', prop: 'tipo.nombre', width: 120 },
            { name: 'F. Registro', prop: 'fechaRegistro', pipe: { transform: (d: Date) => d ? new Date(d).toLocaleDateString() : '' }, width: 120 },
            { name: 'Acciones', cellTemplate: this.colAccionTemplate, width: 150 }
        ];
    }
}