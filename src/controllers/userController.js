import { User } from "../models/user.js";

export class UserController {

    
    /**
     * Create a new User
     */
    // POST /api/users
    static async createUser(req, res) {
        try {
            const { name, lastname, email, nickname, glb, room, subroom } = req.body

            // Verificamos las longitudes de los campos
            if (
                name.length > 150 ||
                lastname.length > 150 ||
                email.length > 150 ||
                nickname.length > 150 ||
                glb.length > 20 ||
                room.length > 150 ||
                subroom.length > 150
            ) {
                return res.status(400).json({ error: 'La longitud de uno o más campos excede el límite permitido.' });
            }


            // Verifica si el usuario ya existe en la base de datos
            const existingUser = await User.findOne({ $or: [{ email }, { nickname }] });
            if (existingUser) {
                return res.status(400).json({ error: 'El correo electrónico o el apodo ya están en uso.' });
            }

            // Crea un nuevo usuario
            const newUser = new User({ username, lastname, email, nickname, glb, room, subroom });
            await newUser.save();


            res.status(201).json({
                info: {
                    message: 'Usuario agregado correctamente',
                    status: true,
                },
                data: newUser,
            });

        } catch (error) {
            console.error('Error al crear usuario:', error);
            res.status(500).json({
                error: 'Error al crear usuario'
            });
        }
    }

    /**
     * Get all users
     */
    // GET /api/users/
    static async getAllUsers(req, res) {
        try {
            // Obtener todos los usuarios de la base de datos
            const users = await User.find();

            // Si no se encontraron usuarios, retornar un mensaje apropiado
            if (!users || users.length === 0) {
                return res.status(404).json({
                    info: {
                        message: 'No se encontraron usuarios',
                        status: false
                    },
                    data: users,
                });
            }

            // Si se encontraron usuarios, retornar los usuarios en la respuesta
            res.status(200).json({
                info: {
                    message: 'Todos los usuarios obtenidos correctamente',
                    status: true
                },
                data: users,
            });
        } catch (error) {
            console.error('Error al obtener todos los usuarios:', error);
            res.status(500).json({
                error: 'Error al obtener todos los usuarios'
            });
        }
    }

    /**
     * Get an User by id
     */
    // GET /api/users/:id
    static async getUserById(req, res) {
        try {
            const userId = req.params.id;

            // Buscar usuario por su ID en la base de datos
            const user = await User.findById(userId);

            // Si no se encuentra el usuario, retornar un mensaje apropiado
            if (!user) {
                return res.status(404).json({
                    info: {
                        message: 'Usuario no encontrado',
                        status: false
                    }
                });
            }

            // Si se encuentra el usuario, retornar el usuario en la respuesta
            res.status(200).json({
                info: {
                    message: 'Usuario obtenido correctamente',
                    status: true
                },
                data: user,
            });
        } catch (error) {
            console.error('Error al obtener usuario por ID:', error);
            res.status(500).json({
                error: 'Error al obtener usuario por ID'
            });
        }
    }

    /**
     * Update User
     */
    // PUT /api/users/:id
    static async updateUser(req, res) {
        try {
            const userId = req.params.id;
            const userData = req.body;

            // Actualizar usuario en la base de datos
            const updatedUser = await User.findByIdAndUpdate(userId, userData, { new: true });

            // Si no se encuentra el usuario, retornar un mensaje apropiado
            if (!updatedUser) {
                return res.status(404).json({
                    info: {
                        message: 'Usuario no encontrado',
                        status: false
                    }
                });
            }

            // Si se actualiza el usuario correctamente, retornar el usuario actualizado en la respuesta
            res.status(200).json({
                info: {
                    message: 'Usuario actualizado correctamente',
                    status: true
                },
                data: updatedUser,
            });
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            res.status(500).json({
                error: 'Error al actualizar usuario'
            });
        }
    }

    /**
     * Delete User
     */
    // DELETE /api/users/:id
    static async deleteUser(req, res) {
        try {
            const userId = req.params.id;

            // Eliminar usuario de la base de datos
            const deletedUser = await User.findByIdAndDelete(userId);

            // Si no se encuentra el usuario, retornar un mensaje apropiado
            if (!deletedUser) {
                return res.status(404).json({
                    info: {
                        message: 'Usuario no encontrado',
                        status: false
                    }
                });
            }

            // Si se elimina el usuario correctamente, retornar un mensaje de éxito
            res.status(200).json({
                info: {
                    message: 'Usuario eliminado correctamente',
                    status: true
                }
            });
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            res.status(500).json({
                error: 'Error al eliminar usuario'
            });
        }
    }

}
