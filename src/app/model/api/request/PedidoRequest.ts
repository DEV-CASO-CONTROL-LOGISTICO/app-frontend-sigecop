import { ClassGeneric } from "../../../util/ClassGeneric";
import { PedidoProductoRequest } from "./PedidoProductoRequest";


export class PedidoRequest extends ClassGeneric{

    id?: number;
    codigo?: String;
    proveedorId?: number;
    proveedorRazonSocial?: string;
    estadoId?: number;  
    descripcion?: string;
    observacion?: string;
    montoTotal?: number;
    fechaRegistro?: Date;
    numeroFactura?: string;
    serieGuia?: string;
    numeroGuia?: string;
    fechaEntrega?: Date;
    observacionEnvio?: string;      
    pedidoProducto?: PedidoProductoRequest[] = [];

}