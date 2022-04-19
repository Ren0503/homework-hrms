const { Server } = require('socket.io');
const { verifyToken } = require('./utils/token');
const notify = require('./constants')

const users = {};

module.exports = (httpServer) => {
    const io = new Server(httpServer, {
        pingTimeout: 60000,
        cors: {
            origin: process.env.FRONTEND_URL,
        }
    });

    io.use((socket, next) => {
        if (socket.handshake.query && socket.handshake.query.token) {
            const decoded = verifyToken(socket.handshake.query.token)
            if (decoded) {
                socket.user = decoded.id;
                next();
            } else {
                return next(new Error('Authentication error'));
            }
        } else {
            return next(new Error('Authentication error'));
        }
    })

    io.on('connection', (socket) => {
        console.log('Connected to socket.io');

        const userId = socket.user;
        if (!users[userId]) {
            users[userId] = {
                socketId: socket.id,
                userId: socket.user,
            };
        }

        socket.on(notify.CREATE_NOTIFICATION, (data) => {
            const user = users[data.user];
            if (user) {
                console.log('Sending create notification, socketId: ', user.socketId);
                io.to(user.socketId).emit(notify.CREATE_NOTIFICATION_REQUEST, data);
            }
        })

        socket.on(notify.DELETE_NOTIFICATION, (data) => {
            const user = users[data.user];
            if (user) {
                console.log('Sending delete notification, socketId: ', user.socketId);
                io.to(user.socketId).emit(notify.DELETE_NOTIFICATION_REQUEST, data);
            }
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
            delete users[socket.user];
        });
    });
}