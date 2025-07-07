import { ClassGeneric } from "../../../util/ClassGeneric";
import { TipoObligacion } from "../../dto/TipoObligacion";
import { EstadoObligacionResponse } from "./EstadoObligacionResponse";
import { PedidoResponse } from "./PedidoResponse";
import { TipoObligacionResponse } from "./TipoObligacionResponse";
import { UserResponse } from "./UserResponse";


export class ObligacionResponse extends ClassGeneric {

    id?: number;
    codigo?: string;
    pedido?: PedidoResponse;
    tipo?: TipoObligacionResponse;
    estado?: EstadoObligacionResponse;
    descripcion?: string;
    monto?: number;
    usuarioCreacion?: UserResponse;
    usuarioEstado?: UserResponse;
    fechaRegistro?: Date;
    
}