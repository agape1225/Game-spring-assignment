const socket = require('socket.io');
const session = require("express-session");
const roomsOneList = []
const roomsTwoList = []
const rooms = []

module.exports = (server, app) => {
    const sessionMiddleware = session({
        secret: "changeit",
        resave: true,
        saveUninitialized: true,
    });

    app.use(sessionMiddleware);
    const io = socket(server, {
        cors: {
            origin: '*',
            credentials: true,
        },
    });

    app.set('socket.io', io);

    //start socket
    io.on('connection', (socket) => {

        // join to room1
        socket.on('join_room_1', async (msg) => {
            let roomName = 'Room_' + msg;
            if (!rooms.includes(roomName)) {
                //insert room number to list
                rooms.push(roomName);
            }
            socket.join(roomName);
            io.to(roomName).emit('response_room_message_1', "방에 입장하였습니다.");
        });

        // chat to room1
        socket.on('req_room_message_1', async (msg) => {
            let userCurrentRoom = getUserCurrentRoom(socket);
            io.to(userCurrentRoom).emit('response_room_message_1', msg);
        });

        // join to room2
        socket.on('join_room_2', async (msg) => {
            let roomName = 'Room_' + msg;
            if (!rooms.includes(roomName)) {
                //insert room number to list
                rooms.push(roomName);
            }
            socket.join(roomName);
            io.to(roomName).emit('response_room_message_2', "방에 입장하였습니다.");
        });

        // chat to room2
        socket.on('req_room_message_2', async (msg) => {
            let userCurrentRoom = getUserCurrentRoom(socket);
            io.to(userCurrentRoom).emit('response_room_message_2', msg);
        });

        // disconnect log
        socket.on('disconnect', async () => {
            console.log('user disconnected');
        });
    });


    // FOR TEST CODE
    (async function () {
    })();

    // GET ROOM NAME
    function getUserCurrentRoom(socket) {
        let currentRoom = '';
        const rooms = socket.rooms;
        rooms.forEach(room => {
            //PARSING ROOM NAME
            if (room.indexOf('Room_') == 0) {
                currentRoom = room;
            }
        });
        return currentRoom;
    }
};