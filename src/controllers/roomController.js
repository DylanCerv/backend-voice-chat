import { Profile } from "../models/profile.js";
import { Room } from "../models/room.js";
import { SubRoom } from "../models/subRoom.js";

export class RoomController {


    /**
     * Create a room
     */
    // POST /api/rooms
    static async createRoom(req, res) {
        try {
            const userId = req.user.userId;
            const { name } = req.body;

            const room = new Room({userId, name});
            await room.save();

            res.status(201).json({ message: 'Sala creada correctamente', data: room });
        } catch (error) {
            console.error('Error al crear la sala:', error);
            res.status(500).json({ error: 'Error al crear la sala' });
        }
    }

    /**
     * Delete a room
     */
    // DELETE /api/rooms/:id
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
    // POST /api/rooms/:id
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
    // DELETE /api/rooms/:id/:subRoomId
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
