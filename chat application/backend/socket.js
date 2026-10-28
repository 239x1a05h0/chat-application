const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Message = require('./models/Message');

function setupSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173'
        }
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error('Authentication required'));
        }
        try {
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            socket.userId = decoded.id;
            next();
        } catch (error) {
            next(new Error('Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.userId);

        socket.join(socket.userId);

        socket.on('sendMessage', async (data) => {
            try {
                const message = await Message.create({
                    conversationId: data.conversationId,
                    sender: socket.userId,
                    text: data.text
                });

                io.to(data.receiver).emit(
                    'receiveMessage',
                    message
                );

                io.to(socket.userId).emit(
                    'receiveMessage',
                    message
                );
            } catch (error) {
                console.log(error.message);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.userId);
        });
    });
}

module.exports = setupSocket;