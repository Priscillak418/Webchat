  
const path = require('path');
const http = require('http');
const express = require('express');
const loginRoute = require("./routes/loginRoute");
const chatRoute = require("./routes/chatRoute");
const socketio = require('socket.io');
const formatMessage = require('./helper/formatDate')
const {
  getActiveUser,
  exitRoom,
  newUser,
  getIndividualRoomUsers
} = require('./helper/userHelper');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//3. configurations
// app.locals.moment = moment;
app.set("view engine", "pug");
app.set("views", "./views");

// (4. middleware)
//body-parser handles reading data from the form element
app.use(express.urlencoded({extended: true})) 
app.use("/static", express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

// this block will run when the client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = newUser(socket.id, username, room);

    socket.join(user.room);

    // General welcome
    socket.emit('message', formatMessage("WebCage", 'Messages are limited to this room! '));

    // Broadcast everytime users connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage("WebCage", `${user.username} has joined the room`)
      );

    // Current active users and room name
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getIndividualRoomUsers(user.room)
    });
  });

  // Listen for client message
  socket.on('chatMessage', msg => {
    const user = getActiveUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = exitRoom(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage("WebCage", `${user.username} has left the room`)
      );

      // Current active users and room name
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getIndividualRoomUsers(user.room)
      });
    }
  });
});

//routes
app.use("/", loginRoute);
app.use("/", chatRoute);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));