import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { PedidoProductoResponse } from '../../model/api/response/PedidoProductoResponse';
import { PedidoProductoRequest } from '../../model/api/request/PedidoProductoRequest';
import { calcularTotal, convertirIsoADDMMAAAA, handleError, setListRow } from '../../util/methods';
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
        FormsModule,
        MatIconModule
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

    facturaFile?: File;
    guiaFile?: File;
    archivoGuia?: String;
    archivoFactura?: String;
    filterEnvio: PedidoRequest = {};

    @ViewChild('colAccionTemplate', { static: true }) colAccionTemplate!: TemplateRef<any>;
    @ViewChild('detallePedidoTemplate', { static: true }) detallePedidoTemplate!: TemplateRef<any>;
    @ViewChild('enviarPedidoTemplate', { static: true }) enviarPedidoTemplate!: TemplateRef<any>;
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
        console.log('openDetallePedido', pedido);
        this.record = {} as PedidoResponse;
        this.observacionEnvio = pedido.observacionEnvio || '';

        forkJoin({
            resultResponse: this.service.find({ id: pedido.id })
            //resultResponseFactura: this.service.descargarArchivoFactura({ id: pedido.id }),
            //resultResponseGuia: this.service.descargarArchivoGuia({ id: pedido.id })    
        }).subscribe({
            //next: ({ resultResponse, resultResponseFactura, resultResponseGuia }) => {
            next: ({ resultResponse }) => {
                this.record = {
                    ...resultResponse,
                    pedidoProducto: (resultResponse.pedidoProducto ?? []).map((pp, index) => ({
                        row: index + 1,
                        id: pp.id,
                        cantidad: pp.cantidad,                        
                        producto: {
                            id: pp.producto?.id,
                            nombre: pp.producto?.nombre,
                            codigo: pp.producto?.id,
                            precioUnitario: pp.producto?.precioUnitario
                        },
                        monto: pp.monto
                    }))
                };
                
                this.observacionEnvio = resultResponse.observacionEnvio || '';
                
            },
            error: (err) => {
                Swal.fire('Error', 'No se pudo cargar el detalle del pedido', 'error');
            }
        });

        this.dialogRef = this.dialog.open(this.detallePedidoTemplate, {
            width: '1000px',
            maxWidth: 'none'
        });
    }

    openEnviarPedido(pedido: PedidoResponse) {
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
                        cantidad: pp.cantidad,                        
                        producto: {
                            id: pp.producto?.id,
                            nombre: pp.producto?.nombre,
                            codigo: pp.producto?.id,
                            precioUnitario: pp.producto?.precioUnitario
                        },
                        monto: pp.monto
                    }))
                };
                
                this.observacionEnvio = resultResponse.observacionEnvio || '';
            },
            error: (err) => {
                Swal.fire('Error', 'No se pudo cargar el detalle del pedido', 'error');
            }
        });

        this.dialogRef = this.dialog.open(this.enviarPedidoTemplate, {
            width: '1000px',
            maxWidth: 'none'
        });
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

    calcularMontoTotalPorProducto(cantidad: number | null | undefined, precioUnitario: number | null | undefined): number | null {
            return calcularTotal(cantidad, precioUnitario);
    }

    onFacturaFileChange(event: any) {
        const file = event.target.files && event.target.files[0];
        if (file && file.type === 'application/pdf') {
            this.facturaFile = file;
            this.archivoFactura = file.name;
            console.log('Factura file selected:', this.facturaFile);
        } else {
            Swal.fire('Error', 'Solo se permite subir archivos PDF para la factura.', 'error');
        }
    }

    onGuiaFileChange(event: any) {
        console.log('onGuiaFileChange', event);
        const fileGuia = event.target.files && event.target.files[0];
        if (fileGuia && fileGuia.type === 'application/pdf') {
            this.guiaFile = fileGuia;
            this.archivoGuia = fileGuia.name;
            console.log('Guía file selected:', this.guiaFile);
        } else {
            Swal.fire('Error', 'Solo se permite subir archivos PDF para la guía.', 'error');
        }
    }

    // Método para enviar archivo de factura
    enviarArchivoFactura() {
        if (!this.facturaFile || !this.record.id) {
            Swal.fire({
                icon: 'warning',
                title: 'Archivo o ID faltante',
                text: 'Debe seleccionar un archivo de factura PDF y tener un pedido válido.',
            });
            return;
        }
        const formData = new FormData();
        formData.append('file', this.facturaFile);
        formData.append('pedidoId', this.record.id.toString());
        this.service.enviarArchivoFactura(formData).subscribe({
            next: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Factura enviada',
                    text: 'El archivo de factura se envió correctamente.'
                });
            },
            error: (err: any) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: err.error || 'No se pudo enviar el archivo de factura.'
                });
            }
        });
    }

    // Método para enviar archivo de guía
    enviarArchivoGuia() {
        if (!this.guiaFile || !this.record.id) {
            Swal.fire({
                icon: 'warning',
                title: 'Archivo o ID faltante',
                text: 'Debe seleccionar un archivo de guía PDF y tener un pedido válido.',
            });
            return;
        }
        const formData = new FormData();
        formData.append('file', this.guiaFile);
        formData.append('pedidoId', this.record.id.toString());
        this.service.enviarArchivoGuia(formData).subscribe({
            next: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Guía enviada',
                    text: 'El archivo de guía se envió correctamente.'
                });
            },
            error: (err: any) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: err.error || 'No se pudo enviar el archivo de guía.'
                });
            }
        });
    }

    descargarFactura() {
        if (!this.record.id) {
            Swal.fire({
                icon: 'warning',
                title: 'ID faltante',
                text: 'No se puede descargar la factura sin un pedido válido.',
            });
            return;
        }
        this.service.descargarArchivoFactura({ id: this.record.id }).subscribe({
            next: (blob: Blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `factura_${this.record.id}.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
            },
            error: (err: any) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: err.error || 'No se pudo descargar el archivo de factura.'
                });
            }
        });
    }

    descargarGuia() {
        if (!this.record.id) {
            Swal.fire({
                icon: 'warning',
                title: 'ID faltante',
                text: 'No se puede descargar la guía sin un pedido válido.',
            });
            return;
        }
        this.service.descargarArchivoGuia({ id: this.record.id }).subscribe({
            next: (blob: Blob) => {
                console.log('Descargando guía', blob);
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `guia_${this.record.id}.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
            },
            error: (err: any) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: err.error || 'No se pudo descargar el archivo de guía.'
                });
            }
        });
    }

    private initTable() {
        this.columns = [
            { name: 'Nro.', prop: 'row', width: 50 },
            { name: 'Código', prop: 'codigo', width: 70 },
            { name: 'Estado', prop: 'estado.descripcion', width: 100 },  
            //{ name: 'Proveedor', prop: 'proveedor.razonSocial', width: 150 },
            { name: 'Descripción', prop: 'descripcion', width: 120 },
            { name: 'Monto Total', prop: 'montoTotal', pipe: { transform: (m: number) => `S/ ${m?.toFixed(2) || '0.00'}` }, width: 100 },
            { name: 'F. Registro', prop: 'fechaRegistro', pipe: { transform: (d: Date) => d ? new Date(d).toLocaleDateString() : '' }, width: 100 },
            { name: 'Acciones', cellTemplate: this.colAccionTemplate, width: 120 }
        ];
    }

    enviar(){
        // Validación de campos obligatorios
        if (!this.record.numeroFactura || !this.record.numeroGuia || !this.record.serieGuia || !this.record.fechaRegistro || !this.record.fechaEntrega) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos obligatorios',
                text: 'Debe completar todos los campos obligatorios: Número de Factura, Número de Guía, Serie de Guía, Fecha Emisión y Fecha Estimada Entrega.',
            });
            return;
        }
        if (!this.facturaFile || !this.record.id) {
            Swal.fire({
                icon: 'warning',
                title: 'Archivo o ID faltante',
                text: 'Debe seleccionar un archivo de factura PDF y tener un pedido válido.',
            });
            return;
        }
        const formDataFactura = new FormData();
        formDataFactura.append('file', this.facturaFile);
        formDataFactura.append('pedidoId', this.record.id.toString());
        formDataFactura.append('numero', this.record.numeroFactura);

         if (!this.guiaFile || !this.record.id) {
            Swal.fire({
                icon: 'warning',
                title: 'Archivo o ID faltante',
                text: 'Debe seleccionar un archivo de guía PDF y tener un pedido válido.',
            });
            return;
        }
        const formDataGuia = new FormData();
        formDataGuia.append('file', this.guiaFile);
        formDataGuia.append('pedidoId', this.record.id.toString());
        formDataGuia.append('numero', this.record.numeroGuia);

        // Transformar record a filterEnvio
        this.filterEnvio = {
            id: this.record.id,
            numeroFactura: this.record.numeroFactura,
            numeroGuia: this.record.numeroGuia,
            serieGuia: this.record.serieGuia,
            fechaRegistro: this.record.fechaRegistro,
            fechaEntrega: this.record.fechaEntrega,
            observacionEnvio: this.observacionEnvio,
        };
        forkJoin({
            resultResponse: this.service.enviarPedido(this.filterEnvio),
            facturaResponse: this.service.enviarArchivoFactura(formDataFactura),
            guiaResponse: this.service.enviarArchivoGuia(formDataGuia)
        }).subscribe({
            next: ({ resultResponse ,facturaResponse,guiaResponse }) => {
                Swal.close();
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'El pedido se ha enviado correctamente.',
                });
                this.dialogRef.close();
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

    calcularTotalRegistrado(): number {
      return this.record?.montoTotal || 0;
    }
    
    calcularSubTotalRegistrado(): number {
        const total = this.calcularTotalRegistrado();
        return parseFloat((total / 1.18).toFixed(2));
    }
}
