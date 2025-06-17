// producto-cotizacion-request.model.ts
import { ClassGeneric } from "../../../util/ClassGeneric";

export class CotizacionProductoRequest extends ClassGeneric {
    id?: number;
    productoId?: number|null;
    productoNombre?: string;
    cantidadSolicitada?: number;
    cantidadCotizada?: number;
    precioUnitario?: number;
}