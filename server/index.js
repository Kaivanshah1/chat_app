const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const {Server} = require('socket.io');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log(`user connected: ${socket.id}`);

    socket.on('send-message', (message) => {
        io.emit('received-message', message);
    })
    
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.get('/', (req, res) => {
    res.send('Hello World');
})
server.listen(3000, () => {
    console.log('listening on 3000');
})