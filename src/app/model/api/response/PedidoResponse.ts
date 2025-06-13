import { ClassGeneric } from "../../../util/ClassGeneric";
import { Proveedor } from "../../dto/Proveedor";
import { UserResponse } from "./UserResponse";
import { PedidoProductoResponse } from "./PedidoProductoResponse";
import { EstadoPedidoResponse } from "./EstadoPedidoResponse";


export class PedidoResponse extends ClassGeneric {

    id?: number;
    codigo?: string;
    proveedor?: Proveedor;
    estado?: EstadoPedidoResponse;
    descripcion?: string;
    observacion?: string;
    montoTotal?: number;
    usuarioCreacion?: UserResponse;
    usuarioEstado?: UserResponse;
    fechaRegistro?: Date;
    numeroFactura?: string;
    serieGuia?: string;
    numeroGuia?: string;
    fechaEntrega?: Date;
    observacionEnvio?: string;        
    pedidoProducto?: PedidoProductoResponse[] = [];
    
}