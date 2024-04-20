import { Router } from 'express';

import { EmailController } from '../controllers/emailController.js';



export const routerEmail = Router();

routerEmail.post('/send', EmailController.sendMail);