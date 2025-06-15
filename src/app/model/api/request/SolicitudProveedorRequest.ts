// producto-cotizacion-request.model.ts
import { ClassGeneric } from "../../../util/ClassGeneric";

export class SolicitudProveedorRequest extends ClassGeneric {
    id?: number;
    proveedorId?: number;
    solicitudId?: number; 
}