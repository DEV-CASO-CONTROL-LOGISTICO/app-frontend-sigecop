// estado-solicitud-response.model.ts
import { ClassGeneric } from "../../../util/ClassGeneric";
import { CotizacionProductoResponse } from "./CotizacionProductoResponse";
import { EstadoCotizacionResponse } from "./EstadoCotizacionResponse";
import { SolicitudProveedorResponse } from "./SolicitudProveedorResponse";
import { UserResponse } from "./UserResponse";

export class CotizacionResponse extends ClassGeneric {
    id?: number;
    solicitudProveedor?: SolicitudProveedorResponse;
    estado?: EstadoCotizacionResponse;
    codigo?: string;
    monto?: number;
    fechaEmision?: Date;
    comentario?: string;
    usuarioCreacion?: UserResponse;
    usuarioEstado?: UserResponse;
    cotizacionProducto?: CotizacionProductoResponse[] = [];
    
    finalizado?: Boolean;
}