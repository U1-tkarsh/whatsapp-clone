//Node server which will handle socket io connections
const io = require('socket.io')(8000, {
    cors: {
        origin: '*',
    }
});

const users = {};

io.on('connection', socket => {
    //if any new user joins, let other users connected to the server know!
    socket.on('new-user-joined', name => {
        console.log(name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message =>{
        //if someone sends a message, broadcast it to the other people
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    //if someone leaves the chat, let others know
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})