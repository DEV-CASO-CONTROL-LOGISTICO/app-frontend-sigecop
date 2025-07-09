//export const BASE_URL = 'https://app-backend-sigecop.onrender.com/api/v1';
export const BASE_URL = 'http://localhost:8080/api/v1';

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

export class RegexConstants {
    static number(event: any): void {
        event.target.value = event.target.value.replace(/\D/g, '');
    }
    static name(event: any): void {
        event.target.value = event.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]/g, '');
    }
    static text(event: any): void {
        event.target.value = event.target.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-.,&/#]/g, '');
    }
    static address(event: any): void {
        event.target.value = event.target.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-,.#/]/g, '');
    }
    static email(event: any): void {
        event.target.value = event.target.value.replace(/[^\w@.\-+]/g, '');
    }
    static username(event: any): void {
        event.target.value = event.target.value.replace(/[^a-zA-Z0-9_]/g, '');
    }
}

export const ESTADO_OBLIGACION = {
    GENERADO_AUTOMATICO: 1,
    PENDIENTE_CONTABILIZAR: 2,
    ENVIADO_APROBACION: 3,
    APROBADO: 4,
    PAGO_CONTABILIZAR: 5,
    PAGO_REGISTRADO: 6,
    OBSERVADO_DOCUMENTOS: 7,
    CONTABILIZADO: 8,

};