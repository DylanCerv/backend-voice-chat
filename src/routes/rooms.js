import { Router } from 'express';

import { RoomController } from '../controllers/roomController.js';
import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware.js';


export const routerRooms = Router();

routerRooms.post('/', [
    verifyTokenMiddleware
], RoomController.createRoom);

routerRooms.delete('/:id', [
    verifyTokenMiddleware
], RoomController.deleteRoom);

routerRooms.post('/:id', [
    verifyTokenMiddleware
], RoomController.createSubRoom);

routerRooms.delete('/:id/:subRoomId', [
    verifyTokenMiddleware
], RoomController.deleteSubRoom);
