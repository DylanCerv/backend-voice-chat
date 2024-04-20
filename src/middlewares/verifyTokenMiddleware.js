import { verifyJWT } from '../utils/jwtHelper.js';
import { sendResponse } from '../utils/utils.js';

export function verifyTokenMiddleware(req, res, next) {

    const authorizationHeader = req.headers.authorization;

    // Verificar si el token existe
    if (!authorizationHeader) {
        return sendResponse(res, 401, true, 'Authentication token not provided');
    }
    const [tokenType, token] = authorizationHeader.split(' ');

    // Verificar y decodificar el token utilizando el helper
    const decodedToken = verifyJWT(token);
    if (!decodedToken) {
        return sendResponse(res, 401, true, 'Invalid authentication');
    } else {
        req.user = decodedToken;
        next();
    }
}
