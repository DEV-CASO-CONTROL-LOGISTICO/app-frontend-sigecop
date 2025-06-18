import { ClassGeneric } from "../../../util/ClassGeneric";
import { ProductoResponse } from "./ProductoResponse";

export class OrdenInternamientoDetalleResponse extends ClassGeneric{
    id?: number;
    ordenInternamientoId?: number;
    producto?: ProductoResponse;
    cantidad?: number;
}
