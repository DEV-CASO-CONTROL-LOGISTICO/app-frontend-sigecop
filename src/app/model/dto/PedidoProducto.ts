import { ClassGeneric } from "../../util/ClassGeneric";

export class PedidoProducto extends ClassGeneric {
    id?: number;
    ruc?: string;
    razonSocial?: string;
    nombreComercial?: string;
    direccion?: string;
    telefono?: string;
    correo?: string;
}