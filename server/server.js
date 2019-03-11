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

    //solo al socket actual si quiero a todos es io.emit
    socket.emit('newMessage',{
        from: 'Admin',
        text: '¡Bienvenido al chat!',
        createdAt: new Date().getTime()
    });

    socket.broadcast.emit('newMessage',{
        from: 'Admin',
        text: 'Nuevo usuario se ha unido',
        createdAt: new Date().getTime()
    })

    socket.on('createMessage', (mes)=>{
        console.log('Mensaje creado: ', mes);
        io.emit('newMessage', {
            from: mes.from,
            text: mes.text,
            createdAt: new Date().getTime()
        });

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