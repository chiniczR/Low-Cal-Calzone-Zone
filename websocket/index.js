var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http, {
    cors: true,
    origins: "*",
   });

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('notification', (msg) => {
        console.log('notification: ' + JSON.stringify(msg));
        io.emit('notify', msg);
    });
    socket.on('checkout', (msg, op) => {
        console.log('CHEKOUT successful: ' + JSON.stringify(msg));
        io.emit('put-order', msg, op);
    });
    socket.on('drop-all', () => {
        console.log('DROP-ALL requested for');
        socket.emit('remove-all');
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
  
http.listen(5000, () => {
    console.log('Listening on port: 5000');
});