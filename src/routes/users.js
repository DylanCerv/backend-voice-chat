import { Router } from 'express';

import { UserController } from '../controllers/userController.js';



export const routerUsers = Router();

routerUsers.post('/', UserController.createUser);

routerUsers.get('/', UserController.getAllUsers);

routerUsers.get('/:id', UserController.getUserById);

routerUsers.put('/:id', UserController.updateUser);

routerUsers.delete('/:id', UserController.deleteUser);



