import { ClassGeneric } from "../../util/ClassGeneric";

export class TipoObligacion extends ClassGeneric{
    id?: number;
    nombre?: string;
    descripcion?: string;
    valorDefecto?: number;
}