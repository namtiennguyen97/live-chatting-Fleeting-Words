const express = require('express')
const app = express();
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
let port = process.env.PORT || 80

let totalUser = 0;
const users = {}
const token = {}
let dataUser = []


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {

    socket.on('user-login', (data)=>{
        users[socket.id] = data.username;
        token[socket.id] = data.token;
        socket.broadcast.emit('new-user', data)
        dataUser.push(data);

    })
    //tra ra danh sach user - main list
    socket.emit('user-arr', dataUser)

    socket.on("disconnecting", () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    });

    socket.on('logout', ()=>{
        totalUser--;
        if (totalUser < 0){
            totalUser = 0;
        }
        io.emit('logout-user', dataUser)
        io.emit('count-user-down', totalUser)
    })

    // cap nhat lai danh sach user
    socket.on('update-user-list', (data)=>{
        dataUser = data;
    })

    // dem so luong user sau khi dang nhap
    socket.on('make-count-user', ()=>{
        totalUser++;
        io.emit('count-total-data', totalUser)
    })

    // dem so luong user ngay ca khi disconnect hay ngat ket noi
    io.emit('count-online', totalUser);

    //chat zone
    socket.on('chat-msg', (data)=>{
        io.in('public').emit('chat-msg', data)
    })

    //vao phong public chung
    socket.on('public-room', (data) => {
        socket.join('public');
    })

    //roi phong
    socket.on("leave room", function(data) {
        socket.leave("public");
    });

    //check username ton tai hay chua
    socket.on('check-user-exist', () => {
        socket.emit('check-user-exist-arr', dataUser)
    })
});


server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
