const { Server } = require('socket.io')

module.exports = (httpServer) => {
    const io = new Server(httpServer, {
        pingTimeout: 60000,
        cors: {
            origin: process.env.FRONTEND_URL,
        }
    });

    io.on('connection', (socket) => {
        console.log('Connected to socket.io');
        socket.on('setup', (userData) => {
            socket.join(userData._id);
            socket.emit('connected');
        });

        socket.off('setup', () => {
            console.log('USER DISCONNECTED');
            socket.leave(userData._id);
        });
    });
}