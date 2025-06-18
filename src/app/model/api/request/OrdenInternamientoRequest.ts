import { ClassGeneric } from "../../../util/ClassGeneric";
import { OrdenInternamientoDetalleRequest } from "./OrdenInternamientoDetalleRequest";

export class OrdenInternamientoRequest extends ClassGeneric {

    id?: number;
    codigo?: String;
    tipoId?: number;
    pedidoId?: number;
    descripcion?: String;
    fechaRegistro?: Date;
    ordenInternamientoDetalle?: OrdenInternamientoDetalleRequest[] = [];
}
