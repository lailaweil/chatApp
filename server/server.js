const path = require ('path');//para que sea mas compatible con otros OS
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado.');

    socket.emit('newMessage', {
        from: 'laila',
        text: 'hey whats up?',
        createdAt: 123
    });

    socket.on('createMessage', (mes)=>{
        console.log('Mensaje creado: ', mes);
    });

    socket.on('disconnect', ()=>{
        console.log('Usuario se ha desconectado.');
    });
});

server.listen(port, ()=>{ 
    console.log(`Connected on port: ${port}`);
});