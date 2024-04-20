import { Router } from 'express';

import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware.js';
import { ProfileController } from '../controllers/profileController.js';


export const routerProfiles = Router();

routerProfiles.get('/', [
    verifyTokenMiddleware
], ProfileController.getProfile);

routerProfiles.put('/', [
    verifyTokenMiddleware
], ProfileController.updateProfile);
