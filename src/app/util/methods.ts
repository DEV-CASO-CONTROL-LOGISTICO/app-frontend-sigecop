import Swal from "sweetalert2";
import { UserResponse } from "../model/api/response/UserResponse";
import { Pagina } from "../model/dto/Pagina";
import { ClassGeneric } from "./ClassGeneric";

export function setListRow(list: ClassGeneric[] | null) {
    if (list) {
        return list.map((item: any, index: number) => ({
            ...item,
            row: index + 1
        }));
    }
    return [];
}

export function parseJwt(token: any): UserResponse {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
                .join('')
        );
        let objectSession = JSON.parse(jsonPayload);
        return {
            id: objectSession?.id,
            nombre: objectSession?.nombre,
            apellidoPaterno: objectSession?.apellidoPaterno,
            apellidoMaterno: objectSession?.apellidoMaterno,
            rol: {
                nombre: objectSession?.perfil,
                paginas: []
            },
            paginas: (objectSession?.pages ?? []).map((x: any): Pagina => {
                return {
                    url: x?.url,
                    nombre: x?.nombre
                }
            })
        };
    } catch (e) {
        return {};
    }
}

export function convertirIsoADDMMAAAA(fechaIso: any): any {
    if (!fechaIso) return null;

    const fecha = new Date(fechaIso);
    if (isNaN(fecha.getTime())) return null; // Verifica si la fecha es inválida

    const dia = String(fecha.getUTCDate()).padStart(2, '0');
    const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0');
    const anio = fecha.getUTCFullYear();

    return `${dia}/${mes}/${anio}`;
}

export function handleError(err: any) {
    const errorMessage = err?.error?.message || err?.error || 'Ocurrió un error inesperado';
    Swal.fire('Error', errorMessage, 'error');
}

export function calcularTotal(cantidad: number | null | undefined, precioUnitario: number | null | undefined): number | null {
    if (cantidad == null || precioUnitario == null || isNaN(cantidad) || isNaN(precioUnitario)) {
        return null;
    }

    const total = cantidad * precioUnitario;
    return parseFloat(total.toFixed(2));
}