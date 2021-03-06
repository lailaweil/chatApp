const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const publicPath = path.join(__dirname, '../public');
const {Users} = require('./utils/users');

const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users;

app.use(express.static(publicPath));

var joinRoom = function (name , room, socket){
  if (!isRealString(name) || !isRealString(room)) {
    return 'Nombre/Grupo deben ser validos.';
  }
  var user = users.getUserByName(name); 
  if(user && user.room === room){
    return 'Ya existe un usuario con ese nombre en este grupo.';
  }
  socket.join(room);
  users.removeUser(socket.id);
  users.addUser(socket.id, name, room);
  io.emit('updateRooms', users.getRooms());
  io.to(room).emit('updateUserList', users.getUserList(room));
  socket.emit('newMessage', generateMessage('Admin', '¡Bienvenido al chat!'));
  socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${name} se ha unido.`));
  return;
};

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('renderRooms', function() {
    socket.emit('updateRooms', users.getRooms());
  });

  socket.on('join', (params, callback) => {
    if(params.rooms){
  
      var err = joinRoom(params.name, params.rooms, socket);
      if(err){
        return callback(err);
      } callback();
    }else{
      var err = joinRoom(params.name, params.room, socket);
      if(err){
        return callback(err);
      } callback();
    }
  
  });

  socket.on('createMessage', (message, callback) => {
    var user = users.getUserById(socket.id);
    if(user && isRealString(message.text)){
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUserById(socket.id);

    if(user){
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if(user){
      io.emit('updateRooms', users.getRooms());
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} se ha desconectado..` ));
    }
    console.log('User was disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});

module.exports = {users}