import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import { Profile } from '../models/profile.js';
import { signJWT } from '../utils/jwtHelper.js';
import {sendResponse, validateEmailFormat, validateRequiredFields} from '../utils/utils.js'


export class AuthController {


    /**
     * Register a user
     */
    // POST /api/auth/register
    static async register(req, res) {
        try {
            const { email, password, name, lastname, phone, nickname, glb } = req.body;

            // Validar la presencia de los campos requeridos
            const requiredFields = ['email', 'password'];
            const missingFields = validateRequiredFields(req.body, requiredFields);
            if (missingFields.length > 0) {
                return sendResponse(res, 400, true, `The fields are required: ${missingFields.join(', ')}`);
            }

            // Validar si el email tiene un formato válido
            if (!validateEmailFormat(email)) {
                return sendResponse(res, 400, true, 'The email does not have a valid format');
            }

            // Verificar si el nombre de usuario ya existe
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return sendResponse(res, 400, true, 'Email is already in use');
            }

            // Crear un nuevo usuario
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ email, password: hashedPassword });
            await newUser.save();

            // const newProfile = new Profile({userId: newUser._id, name, lastname, phone, nickname, glb });
            // await newProfile.save();

            // Generar token de autenticación
            const token = signJWT({ userId: newUser._id });

            return sendResponse(res, 201, false, 'Registred', null, { token: token });
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            res.status(500).json({ error: 'Error al registrar usuario' });
        }
    }

    /**
     * Login a user
     */
    // POST /api/auth/login
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Verificar si el usuario existe
            const user = await User.findOne({ email });
            if (!user) {
                return sendResponse(res, 401, true, 'Invalid credentials');
            }

            // Verificar la contraseña
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return sendResponse(res, 401, true, 'Invalid credentials');
            }

            // Generar token de autenticación
            const token = signJWT({ userId: user._id });

            return sendResponse(res, 201, false, 'Successful login', null, { token: token });
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            res.status(500).json({ error: 'Error al iniciar sesión' });
        }
    }

}
