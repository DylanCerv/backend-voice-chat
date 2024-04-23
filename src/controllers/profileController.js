import { Profile } from "../models/profile.js";
import { sendResponse } from "../utils/utils.js";


export class ProfileController {

    /**
     * Get profile
     */
    // GET /api/profile
    static async getProfile(req, res) {
        try {
            const userId = req.user.userId;

            const profile = await Profile.findOne({ userId });
            if (!profile) {
                return sendResponse(res, 400, true, 'Perfil de usuario no encontrado');
            }

            return sendResponse(res, 200, false, 'Perfil de usuario obtenido correctamente', profile);
        } catch (error) {
            console.error('Error al obtener el perfil de usuario:', error);
            return sendResponse(res, 500, true, 'Error al obtener el perfil de usuario');
        }
    }

    /**
     * Update profile
     */
    // PUT /api/profile
    static async updateProfile(req, res) {
        try {
            const userId = req.user.userId;
            const { username, glb } = req.body;

            // Buscar y actualizar el perfil del usuario
            const profileUpdated = await Profile.findOneAndUpdate({ userId }, { username, glb }, { new: true });

            if (!profileUpdated) {
                return sendResponse(res, 404, true, 'Perfil de usuario no encontrado');
            }

            return sendResponse(res, 200, false, 'Perfil de usuario actualizado correctamente', profileUpdated);
        } catch (error) {
            console.error('Error al actualizar el perfil de usuario:', error);
            return sendResponse(res, 500, true, 'Error al actualizar el perfil de usuario');
        }
    }

}
