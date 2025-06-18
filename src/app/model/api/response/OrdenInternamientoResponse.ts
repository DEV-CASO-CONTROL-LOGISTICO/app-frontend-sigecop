import { ClassGeneric } from "../../../util/ClassGeneric";
import { TipoInternamiento } from "../../dto/TipoInternamiento";
import { OrdenInternamientoDetalleResponse } from "./OrdenInternamientoDetalleResponse";
import { PedidoResponse } from "./PedidoResponse";
import { UserResponse } from "./UserResponse";

export class OrdenInternamientoResponse extends ClassGeneric {
    id?: number;
    codigo?: String;
    tipo?: TipoInternamiento;
    pedido?: PedidoResponse;
    descripcion?: String;
    usuarioCreacion?: UserResponse;
    fechaRegistro?: Date;
    detalles?: OrdenInternamientoDetalleResponse [] = [];
}