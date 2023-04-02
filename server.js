const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/public/admin.html');
});

io.on('connection', (socket) => {
    console.log('Użytkownik połączony:', socket.id);

    socket.on('new-user', (role) => {
        socket.join(role);
    });

    socket.on('message', (data) => {
        if (socket.rooms.has('admin')) {
            io.to(data.socketId).emit('message', data.msg);
        } else {
            io.to('admin').emit('message', { socketId: socket.id, msg: data });
        }
    });

    socket.on('disconnect', () => {
        console.log('Użytkownik rozłączony:', socket.id);
        io.to('admin').emit('user-disconnected', socket.id);
    });
});

http.listen(process.env.PORT || 8080, () => {
    console.log('Serwer działa.');
});