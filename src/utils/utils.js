// Función para validar los campos requeridos
export function validateRequiredFields(body, requiredFields) {
    const missingFields = [];
    requiredFields.forEach(field => {
        if (!body[field]) {
            missingFields.push(field);
        }
    });
    return missingFields;
}

// Función para validar el formato del correo electrónico
export function validateEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Función para enviar respuestas JSON consistentes  (Estándar).
 * 
 * @param {object} res - Objeto de respuesta de Express.
 * @param {number} statusCode - Código de estado HTTP de la respuesta.
 * @param {boolean} [error=false] - Indica si la respuesta es un error (opcional, por defecto es false).
 * @param {string} message - Mensaje de la respuesta.
 * @param {Array|null} data - Datos para incluir en la respuesta (opcional).
 * @param {object|null} otherData - Otros datos para incluir en la respuesta (opcional).
 * @returns {object} Objeto de respuesta JSON.
 */
export function sendResponse(res, statusCode, error=false, message, data = null, otherData=null) {
    const responseData = {
        error: error ? true : false,
        statusCode: statusCode,
        message: message
    };
    if (data) {
        responseData.data = data;
    }
    if (otherData) {
        Object.assign(responseData, otherData);
    }
    return res.status(statusCode).json(responseData);
}
