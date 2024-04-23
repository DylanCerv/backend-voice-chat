import { instrument } from "@socket.io/admin-ui";
import { Server as SocketServer } from 'socket.io'


export const setupSocket = (httpServer) => {
  // setting up the socket io server

  const io = new SocketServer(httpServer, {
    // to allow cors
    cors: {
      origin: ["*", "https://admin.socket.io", "http://localhost:5173"],
      credentials: true
    },
    // transports: ['websocket']
  });

  // setting up the admin panel
  instrument(io, {
    auth: false,
    mode: "development",
  });

  //open a connection with the specific client
  io.on("connection", function (socket) {
    console.log('Conectado al websocket')

    socket.broadcast.emit("NEW", "new user connected: " + socket.id);

    // handeling sending voices
    socket.on("VOICE", function (data) {
      var newData = data.split(";");
      newData[0] = "data:audio/ogg;";
      newData = newData[0] + newData[1];

      // emit to all the rooms of the client
      socket.rooms.forEach(room => {
        // basically skips sending the voice to the player
        if (room != socket.id) {
          socket.to(room).emit("UPDATE_VOICE", newData, socket.id);
        }
      });
    });

    // handles returning client rooms
    socket.on("getRooms", function () {
      var rooms = [];
      socket.rooms.forEach(room => {
        rooms.push(room);
        console.log(room);
      })
      rooms.shift();
      socket.emit("Rooms", rooms);
    });

    // handles joining rooms for clients
    socket.on("joinRoom", function (roomID) {
      socket.join(roomID);
      console.log(socket.id + " has joined room: " + roomID)
      socket.to(roomID).emit("onJoinRoom", socket.id, roomID);
    });

    // handles leaving rooms for clients
    socket.on("leaveRoom", function (roomID) {
      socket.leave(roomID);
      console.log(socket.id + " has left room: " + roomID)
      socket.to(roomID).emit("onLeftRoom", socket.id, roomID);
    });

    // handles the retrival of clients socket's id connected to a given room
    socket.on("getClientsInRoom", async function (roomID) {
      const sockets = await io.in(roomID).fetchSockets();
      let clients = [];
      for (const clientSocket of sockets) {
        clients.push(clientSocket.id);
      }

      socket.emit("clientsInRoom", clients);
    });

    // handles leaving all the rooms for clients
    socket.on("leaveAllRooms", function () {
      socket.rooms.forEach((room) => {
        if (room != socket.id) {
          socket.leave(room);
          socket.to(room).emit("onLeftRoom", socket.id, room);
        }
      });
    });

    socket.on("disconnect", () => {
      console.log('Desconectado del websocket')
    });
  });
}