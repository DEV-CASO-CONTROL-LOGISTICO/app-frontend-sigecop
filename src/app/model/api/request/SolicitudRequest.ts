import { ClassGeneric } from "../../../util/ClassGeneric";
import { SolicitudProductoRequest } from "./SolicitudProductoRequest";

export class SolicitudRequest extends ClassGeneric{

    id?: number;
    codigo?: String;
    descripcion?: string;
    fechaCreacion?: Date;
    estadoId?: number;
    proveedores?: number[] = [];
    solicitudProducto?: SolicitudProductoRequest[] = [];
}