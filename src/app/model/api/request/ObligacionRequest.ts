import { ClassGeneric } from "../../../util/ClassGeneric";


export class ObligacionRequest extends ClassGeneric{

    id?: number;
    codigo?: string;
    pedidoId?: number;
    tipoId?: number;
    estadoId?: number;  
    descripcion?: string;
    monto?: number;
    fechaRegistro?: Date;
    proveedorRazonSocial?: string;
    fechaPago?: Date;
    nombreUsuarioPago?: string;
    cuentaBancariaTemporal?: string;
}