import { ClassGeneric } from "../../../util/ClassGeneric";
import { PedidoProductoRequest } from "./PedidoProductoRequest";


export class ObligacionRequest extends ClassGeneric{

    id?: number;
    codigo?: String;
    pedidoId?: number;
    tipoId?: number;
    estadoId?: number;  
    descripcion?: string;
    monto?: number;
    fechaRegistro?: Date;
    proveedorRazonSocial?: string;
}