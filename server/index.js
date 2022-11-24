const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { log } = require("console");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:4000",//client
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  //joinRoom
  socket.on('join_room', function (data) {
    socket.join(data);
    console.log('join', data);
  })

  //sendMess
  socket.on('send_message', function (data) {
    socket.in(data.room).emit('receive_message', data)
    console.log(data);
  })

  //leaveRoom
  socket.on("disconnect", (data) => {
    console.log("User Disconnected", socket.id);
  });

  socket.on("quitRoom", (data) => {
    let noti = (data.author + ' quit at ' + data.time);
    console.log(noti);
    socket.emit('rec_noti', noti, data.room);
    socket.in(data.room).emit('receive_message', noti)
  })

});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
