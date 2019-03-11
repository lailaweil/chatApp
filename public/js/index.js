var socket = io();

        socket.on('connect', function() {
            console.log('Conectado al server.');
        });

        socket.on('disconnect', function() {
            console.log('Se ha desconectado del server.');
        });

        socket.on('newMessage', function(mes){
            console.log('Nuevo mensaje: ', mes);
        } );