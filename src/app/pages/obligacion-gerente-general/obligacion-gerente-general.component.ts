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
import { ESTADO_OBLIGACION } from '../../util/constant';
import { ObligacionResponse } from "../../model/api/response/ObligacionResponse";
import { ObligacionRequest } from "../../model/api/request/ObligacionRequest";
import { EstadoObligacionResponse } from "../../model/api/response/EstadoObligacionResponse";
import { ObligacionService } from "../../service/gestion/obligacion.service";
import { EstadoObligacionService } from "../../service/gestion/estadoObligacion.service";
import Swal from "sweetalert2";
import { convertirIsoADDMMAAAA, setListRow } from "../../util/methods";
import { TipoObligacionService } from "../../service/master/tipoObligacion.service";
import { TipoObligacionResponse } from "../../model/api/response/TipoObligacionResponse";
import { PedidoResponse } from "../../model/api/response/PedidoResponse";
import { PedidoService } from "../../service/gestion/pedido.service";

@Component({
    selector: 'app-obligacion-gerente-general',
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
    templateUrl: './obligacion-gerente-general.component.html',
    styleUrl: './obligacion-gerente-general.component.css'
})

export class ObligacionGerenteGeneralComponent implements OnInit {
    public RG = RegexConstants;
    result: ObligacionResponse[] = [];
    filter: ObligacionRequest = {};
    record: ObligacionRequest = {};
    obligacionSelected: ObligacionResponse = {};
    columns: any[] = [];

    listEstados: EstadoObligacionResponse[] = [];
    listTipos: TipoObligacionResponse[] = [];

    @ViewChild('colAccionTemplate', { static: true }) colAccionTemplate!: TemplateRef<any>;
    @ViewChild('dialogTemplate', { static: true }) dialogTemplate!: TemplateRef<any>;
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

    search() {
        this.filter.estadoId = ESTADO_OBLIGACION.APROBADO; // Por defecto, mostrar solo pedidos con estado "GENERADO
        console.log('filter', this.filter);
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
        this.dialogRef = this.dialog.open(this.dialogTemplate, { width: '800px' });
    }

    openEnviar(item: ObligacionResponse) {
        Swal.fire({
            title: 'Confirmar Aceptación de Obligación',
            text: `¿Está seguro de aceptar la obligación ${item.codigo}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, aceptar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                 
                if (item.estado) {
                    item.estado.id = 0;
                }

                if (item.id !== undefined) {
                    this.service.changeStatus({ id: item.id, estadoId: ESTADO_OBLIGACION.PAGO_CONTABILIZAR }).subscribe({
                        next: () => {
                            Swal.fire('Éxito', 'Obligación aceptada', 'success');
                            this.search();
                            this.cdr.detectChanges();
                        },
                        error: (err) => {
                            this.handleError(err);
                        }
                    });
                } else {
                    Swal.fire('Error', 'El ID de la obligación no está definido', 'error');
                }
            }
        });
    }

    openDetalleObligacion(item: ObligacionResponse) {
        this.service.find({ id: item.id }).subscribe({
            next: (resultResponse) => {
                this.obligacionSelected = resultResponse;
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
    
        this.dialogRef = this.dialog.open(this.detalleObligacionTemplate, { width: '800px' });
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

        if (!this.record.estadoId) {
            Swal.fire('Error', 'Seleccione un estado', 'error');
            return;
        }

        if (!this.record.tipoId) {
            Swal.fire('Error', 'Seleccione un tipo', 'error');
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
                this.service.changeStatus({ id: item.id, estadoId: ESTADO_OBLIGACION.ENVIADO_APROBACION }).subscribe({
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

    getEstadoDescripcion(estadoId?: number): string {
        const estado = estadoId ? this.listEstados.find(e => e.id === estadoId) : null;
        return estado?.descripcion ?? 'No especificado';
    }

    getTipoDescripcion(tipoId?: number): string {
        const tipo = tipoId ? this.listTipos.find(t => t.id === tipoId) : null;
        return tipo?.nombre ?? 'No especificado';
    }

    /*getPedidoDescripcion(pedidoId?: number): string {
        const pedido = pedidoId ? this.listPedidos.find(p => p.id === pedidoId) : null;
        return pedido ? `${pedido.codigo} - ${pedido.proveedor?.razonSocial}` : 'No especificado';
    }*/

    private initTable() {
        this.columns = [
            { name: 'Nro.', prop: 'row', width: 50 },
            { name: 'Código', prop: 'codigo', width: 100 },
            { name: 'Pedido', prop: 'pedido', width: 200, pipe: { transform: (pedido: any) => {
                if (!pedido) return 'No especificado';
                    const codigo = pedido.codigo || '';
                    const razonSocial = pedido.proveedor?.razonSocial || '';
                    return `${codigo} - ${razonSocial}`;
                }}},
            { name: 'Estado', prop: 'estado.descripcion', width: 120 },
            { name: 'Tipo', prop: 'tipo.nombre', width: 120 },
            { name: 'Monto', prop: 'monto', pipe: { transform: (m: number) => `S/ ${m?.toFixed(2) || '0.00'}` }, width: 100 },
            { name: 'F. Registro', prop: 'fechaRegistro', pipe: { transform: (d: Date) => d ? new Date(d).toLocaleDateString() : '' }, width: 120 },
            { name: 'Acciones', cellTemplate: this.colAccionTemplate, width: 150 }
        ];
    }
}