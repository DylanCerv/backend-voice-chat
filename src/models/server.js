import express from 'express'; 
import cors from 'cors';

import mongoose from 'mongoose';

// Routes
import { routerAuth } from '../routes/auth.js';
import { routerUsers } from '../routes/users.js';
import { routerProfiles } from '../routes/profiles.js';
import { routerRooms } from '../routes/rooms.js';
import { routerEmail } from '../routes/email.js';


class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8080;

    // Se agregan las siguientes variables para el uso de las rutas
    this.path = {
      auth:    '/api/auth',
      users:    '/api/users',
      rooms: '/api/rooms',
      profiles: '/api/profiles',
      emails: '/api/emails',
    }

    // DB
    this.connectionDB();

    // Middlewares
    this.middlewares();

    // Rutas de la app
    this.routes();
  }

  connectionDB() {
    mongoose
    .connect(process.env.MONGODB_URI)
    .then(()=>console.log("Connected to MongoDB"))
    .catch((error)=>console.error(`Failed to connect to MongoDB: ${error}`))
  }

  middlewares() {
    // CORS
    this.app.use( cors() );

    // Lectura y parseo del body
    this.app.use( express.json() );

    // Directorio público
    this.app.use( express.static('public') );
  }
  
  routes() {
    // Rutas para el uso de app
    this.app.use( this.path.auth, routerAuth);
    this.app.use( this.path.users, routerUsers);
    this.app.use( this.path.profiles, routerProfiles);
    this.app.use( this.path.rooms, routerRooms);
    this.app.use( this.path.emails, routerEmail);
    
    // Error 404
    this.app.use('*', (req, res) => {
      res.status(400).json({ message: 'Endpoint no encontrado'});
    });

  }

  listen() {
    this.app.listen( this.port, () => {
      console.log(`Servidor corriendo en http://localhost:${this.port}`);
    });
  }

}

export default Server;
