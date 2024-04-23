import { Profile } from "../models/profile.js";
import { Room } from "../models/room.js";
import { SubRoom } from "../models/subRoom.js";
import { sendResponse } from "../utils/utils.js";

export class RoomController {


    /**
     * Create a room (Guarda una sala)
     */
    // POST /api/salas
    static async createRoom(req, res) {
        try {
            const userId = req.user.userId;
            const { hash } = req.body;

            // Verificar si el usuario tiene una sala registrada
            const existingRoom = await Room.findOne({ userId });
            if (existingRoom) {
                // Si existe la sala actualizala
                await Room.findOneAndUpdate({ userId }, { hash }, { new: true });
            }else {
                // Crear la sala si no existe
                const room = new Room({userId, hash});
                await room.save();
            }

            return sendResponse(res, 201, false, 'Sala creada correctamente');
        } catch (error) {
            console.error('Error al crear la sala:', error);
            sendResponse(res, 500, true, 'Error al crear la sala');
        }
    }

    /**
     * Obtener la sala del usuario
     */
    // GET /api/salas
    static async getRoom(req, res) {
        try {
            const userId = req.user.userId;

            const room = await Room.findOne({ userId });
            if (!room) {
                return sendResponse(res, 400, true, 'El usuario no tiene una sala');
            }

            return sendResponse(res, 200, false, 'Sala del usuario obtenida correctamente', null, room);
        } catch (error) {
            console.error('Error al obtener la sala del usaurio: ', error);
            return sendResponse(res, 500, true, 'Error al obtener la sala del usaurio');
        }
    }

    /**
     * Delete a room
     */
    // DELETE /api/salas/:id
    static async deleteRoom(req, res) {
        try {
            const roomId = req.params.id;
            await Room.findByIdAndDelete(roomId);
            res.json({ message: 'Sala eliminada correctamente' });
        } catch (error) {
            console.error('Error al eliminar la sala:', error);
            res.status(500).json({ error: 'Error al eliminar la sala' });
        }
    }

    /**
     * Create a SubRoom
     */
    // POST /api/salas/:id
    static async createSubRoom(req, res) {
        try {
            const userId = req.user.userId;
            const { id } = req.params;
            const { name } = req.body;


            // Buscar y actualizar el perfil del usuario
            const profile = await Profile.findOne({userId});
            if (!profile) {
                return res.status(404).json({ error: 'El usuario no existe' });
            }

            // Validar que la sala pertenezca al usuario
            const room = await Room.findOne({_id: id, userId});
            console.log({_id: id, userId})
            if (!room) {
                return res.status(404).json({ error: 'La sala especificada no existe' });
            }

            // Crear la subroom
            const subRoom = new SubRoom({ roomId: id, name });
            await subRoom.save();

            res.status(201).json({ message: 'Subsala creada correctamente', data: subRoom });
        } catch (error) {
            console.error('Error al crear la subsala:', error);
            res.status(500).json({ error: 'Error al crear la subsala' });
        }
    }

    /**
     * Delete a SubRoom
     */
    // DELETE /api/salas/:id/:subRoomId
    static async deleteSubRoom(req, res) {
        try {
            const {id, subRoomId} = req.params;

            // Verificar si la sala existe
            const room = await Room.findById(id);
            if (!room) {
                return res.status(404).json({ error: 'La sala no existe' });
            }

            // Verificar si la subsala pertenece a la sala
            const subRoom = await SubRoom.findOne({ _id: subRoomId, roomId: id });
            if (!subRoom) {
                return res.status(404).json({ error: 'La subsala no existe en esta sala' });
            }
            
            // Eliminar la subsala
            await SubRoom.findByIdAndDelete(subRoomId);
            res.json({ message: 'Subsala eliminada correctamente' });
        } catch (error) {
            console.error('Error al eliminar la subsala:', error);
            res.status(500).json({ error: 'Error al eliminar la subsala' });
        }
    }

}
