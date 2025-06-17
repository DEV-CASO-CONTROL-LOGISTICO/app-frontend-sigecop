import { ClassGeneric } from "../../../util/ClassGeneric";
import { Proveedor } from "../../dto/Proveedor";
import { UserResponse } from "./UserResponse";
import { SolicitudProductoResponse } from "./SolicitudProductoResponse";
import { EstadoSolicitud } from "../../dto/EstadoSolicitud";
import { CotizacionResponse } from "./CotizacionResponse";

export class SolicitudResponse extends ClassGeneric {

    id?: number;
    codigo?: string;
    descripcion?: string;
    fechaCreacion?: Date;
    fechaFinalizado?: Date;
    usuarioCreacion?: UserResponse;
    usuarioEstado?: UserResponse;
    estado?: EstadoSolicitud;
    finalizado?: Boolean;
    proveedores?: Proveedor[] = [];
    solicitudProducto?: SolicitudProductoResponse[] = [];

    solicitudProveedorActualId?: number;
    cotizacionActual?: CotizacionResponse;
}