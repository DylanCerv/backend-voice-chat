import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import http from 'http'

// Utilities
import { sendResponse } from '../utils/utils.js';

// Socket
import { setupSocket } from '../socket/socketConnections.js';
import { Server as SocketServer } from 'socket.io'
import { instrument } from '@socket.io/admin-ui';

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
    this.httpServer = http.createServer(this.app);


    // Se agregan las siguientes variables para el uso de las rutas
    this.path = {
      auth: '/api/auth',
      users: '/api/users',
      rooms: '/api/salas',
      profiles: '/api/profile',
      emails: '/api/emails',
    }

    // DB
    this.connectionDB();

    // Middlewares
    this.middlewares();

    // Rutas de la app
    this.routes();

    // Socket.io setup
    // this.setupSocket();
    setupSocket(this.httpServer)
  }

  connectionDB() {
    mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => console.log("Connected to MongoDB"))
      .catch((error) => console.error(`Failed to connect to MongoDB: ${error}`))
  }

  middlewares() {
    // CORS
    this.app.use(
      cors({
        allowedHeaders: ["authorization", "Content-Type"], // you can change the headers
        exposedHeaders: ["authorization"], // you can change the headers
        origin: ["*", "http://localhost:5173"],
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false
      })
    );

    // Lectura y parseo del body
    this.app.use(express.json());

    // Directorio público
    this.app.use(express.static('public'));
  }

  routes() {
    // Rutas para el uso de app
    this.app.use(this.path.auth, routerAuth);
    this.app.use(this.path.users, routerUsers);
    this.app.use(this.path.profiles, routerProfiles);
    this.app.use(this.path.rooms, routerRooms);
    this.app.use(this.path.emails, routerEmail);

    // Error 404
    this.app.use('*', (req, res) => {
      sendResponse(res, 400, true, 'Endpoint no encontrado');
    });

  }

  // setupSocket() {
  //   // setting up the socket io server

  //   const io = new SocketServer(this.httpServer, {
  //     // to allow cors
  //     cors: {
  //       origin: ["*", "https://admin.socket.io", "http://localhost:5173"],
  //       credentials: true
  //     },
  //     // transports: ['websocket']
  //   });

  //   // setting up the admin panel
  //   instrument(io, {
  //     auth: false,
  //     mode: "development",
  //   });

  //   //open a connection with the specific client
  //   io.on("connection", function (socket) {
  //     console.log('Conectado al websocket')

  //     socket.broadcast.emit("NEW", "new user connected: " + socket.id);

  //     // handeling sending voices
  //     socket.on("VOICE", function (data) {
  //       var newData = data.split(";");
  //       newData[0] = "data:audio/ogg;";
  //       newData = newData[0] + newData[1];

  //       // emit to all the rooms of the client
  //       socket.rooms.forEach(room => {
  //         // basically skips sending the voice to the player
  //         if (room != socket.id) {
  //           socket.to(room).emit("UPDATE_VOICE", newData, socket.id);
  //         }
  //       });
  //     });

  //     // handles returning client rooms
  //     socket.on("getRooms", function () {
  //       var rooms = [];
  //       socket.rooms.forEach(room => {
  //         rooms.push(room);
  //         console.log(room);
  //       })
  //       rooms.shift();
  //       socket.emit("Rooms", rooms);
  //     });

  //     // handles joining rooms for clients
  //     socket.on("joinRoom", function (roomID) {
  //       socket.join(roomID);
  //       console.log(socket.id + " has joined room: " + roomID)
  //       socket.to(roomID).emit("onJoinRoom", socket.id, roomID);
  //     });

  //     // handles leaving rooms for clients
  //     socket.on("leaveRoom", function (roomID) {
  //       socket.leave(roomID);
  //       console.log(socket.id + " has left room: " + roomID)
  //       socket.to(roomID).emit("onLeftRoom", socket.id, roomID);
  //     });

  //     // handles the retrival of clients socket's id connected to a given room
  //     socket.on("getClientsInRoom", async function (roomID) {
  //       const sockets = await io.in(roomID).fetchSockets();
  //       let clients = [];
  //       for (const clientSocket of sockets) {
  //         clients.push(clientSocket.id);
  //       }

  //       socket.emit("clientsInRoom", clients);
  //     });

  //     // handles leaving all the rooms for clients
  //     socket.on("leaveAllRooms", function () {
  //       socket.rooms.forEach((room) => {
  //         if (room != socket.id) {
  //           socket.leave(room);
  //           socket.to(room).emit("onLeftRoom", socket.id, room);
  //         }
  //       });
  //     });

  //     socket.on("disconnect", () => {
  //       console.log('Desconectado del websocket')
  //     });
  //   });
  // }

  listen() {

    // this.app.listen(this.port, () => {
    //   console.log(`Servidor corriendo en http://localhost:${this.port}`);
    // });
    this.httpServer.listen(this.port, () => {
      console.log(`Servidor socket corriendo en http://localhost:${this.port}`);
    });
  }

}

export default Server;
