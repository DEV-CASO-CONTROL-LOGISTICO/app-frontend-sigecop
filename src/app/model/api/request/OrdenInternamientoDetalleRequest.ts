import { ClassGeneric } from "../../../util/ClassGeneric";

export class OrdenInternamientoDetalleRequest extends ClassGeneric {
    id?: number;
    ordenInternamientoId?: number;
    productoId?: number;
    cantidad?: number;
}
