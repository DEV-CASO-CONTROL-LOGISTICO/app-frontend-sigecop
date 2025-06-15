import { ClassGeneric } from "../../../util/ClassGeneric";

export class PedidoProductoRequest extends ClassGeneric {
    id?: number;
    pedidoId?: number;
    productoId?: number;
    cantidad?: number;
    productoNombre?: String;
}