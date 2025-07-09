import { ClassGeneric } from "../../../util/ClassGeneric";
import { EstadoObligacionResponse } from "./EstadoObligacionResponse";
import { PedidoResponse } from "./PedidoResponse";
import { TipoObligacionResponse } from "./TipoObligacionResponse";
import { UserResponse } from "./UserResponse";


export class ObligacionResponse extends ClassGeneric {

    id?: number;
    codigo?: string;    
    tipo?: TipoObligacionResponse;
    estado?: EstadoObligacionResponse;
    descripcion?: string;
    monto?: number;
    usuarioCreacion?: UserResponse;
    usuarioEstado?: UserResponse;
    fechaRegistro?: Date;
    esContabilizado?: Boolean;         
    esAprobado?: Boolean;         
    esPorContabilizar?: Boolean;
    esRegistrado?: Boolean;         
    esGenerado?: Boolean;         
    esPendiente?: Boolean; 
    pedido?: PedidoResponse;
    fechaPago?: Date;
    nombreUsuarioPago?: string;
    cuentaBancariaTemporal?: string;
}