const path = require ('path');//para que sea mas compatible con otros OS
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');

const admin = 'Admin';
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado.');

    //solo al socket actual si quiero a todos es io.emit
    socket.emit('newMessage',generateMessage(admin,'¡Bienvenido al chat!'));

    socket.broadcast.emit('newMessage',generateMessage(admin, 'Nuevo usuario se ha unido.'));

    socket.on('createMessage', (mes)=>{
        console.log('Mensaje creado: ', mes);

        io.emit('newMessage', generateMessage(mes.from,mes.text));

        // socket.broadcast.emit('newMessage', {
        //         from: mes.from,
        //         text: mes.text,
        //         createdAt: new Date().getTime()
        // });
    });

    socket.on('disconnect', ()=>{
        console.log('Usuario se ha desconectado.');
    });
});

server.listen(port, ()=>{ 
    console.log(`Connected on port: ${port}`);
});