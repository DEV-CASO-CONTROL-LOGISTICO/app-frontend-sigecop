import { ClassGeneric } from "../../../util/ClassGeneric";

export class TipoObligacionResponse extends ClassGeneric{
    id?: number;
    nombre?: string;
    descripcion?: string;
    valorDefecto?: number;
}