import { CotizacionProductoRequest } from "./CotizacionProductoRequest";
import { SolicitudRequest } from "./SolicitudRequest";

export class CotizacionRequest {

    id?: number;
    solicitudId?: number;
    solicitudProveedorId?: number;
    codigo?: String;
    comentario?: String;
    monto?: number;
    cotizacionProducto?: CotizacionProductoRequest[] = [];
    solicitud?: SolicitudRequest;
}