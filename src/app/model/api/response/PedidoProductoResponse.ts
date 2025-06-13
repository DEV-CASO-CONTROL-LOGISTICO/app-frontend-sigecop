import { ClassGeneric } from "../../../util/ClassGeneric";
import { PedidoResponse } from "./PedidoResponse";
import { ProductoResponse } from "./ProductoResponse";


export class PedidoProductoResponse extends ClassGeneric {
    id?: number;
    pedido?: PedidoResponse;
    producto?: ProductoResponse;
    cantidad?: number;
}