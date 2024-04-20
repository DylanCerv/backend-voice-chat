import { Profile } from "../models/profile.js";


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
                return res.status(404).json({ error: 'Perfil de usuario no encontrado' });
            }

            res.status(200).json({ message: 'Perfil de usuario obtenido correctamente', profile });
        } catch (error) {
            console.error('Error al actualizar el perfil de usuario:', error);
            res.status(500).json({ error: 'Error al actualizar el perfil de usuario' });
        }
    }

    /**
     * Update profile
     */
    // PUT /api/profile
    static async updateProfile(req, res) {
        try {
            const userId = req.user.userId;
            const { name, lastname, phone, nickname, glb } = req.body;

            // Buscar y actualizar el perfil del usuario
            const profile = await Profile.findOneAndUpdate({ userId }, { name, lastname, phone, nickname, glb }, { new: true });

            if (!profile) {
                return res.status(404).json({ error: 'Perfil de usuario no encontrado' });
            }

            res.status(200).json({ message: 'Perfil de usuario actualizado correctamente', profile });
        } catch (error) {
            console.error('Error al actualizar el perfil de usuario:', error);
            res.status(500).json({ error: 'Error al actualizar el perfil de usuario' });
        }
    }

}
