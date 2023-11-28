const socket = require('socket.io');
const rooms = []
module.exports = (server, app) => {
  const io = socket(server, {
    cors: {
      origin: '*',
      credentials: true,
    },
  });
  app.set('socket.io', io);

  io.on('connection', (socket)=>{
    socket.on('request_message', (msg) => {
        // response_message로 접속중인 모든 사용자에게 msg 를 담은 정보를 방출한다.
        io.emit('response_message', msg);
    });

    // 방참여 요청
    socket.on('req_join_room', async (msg) => {
        let roomName = 'Room_' + msg;
        if(!rooms.includes(roomName)) {
            rooms.push(roomName);
        }else{
            
        }
        socket.join(roomName);
        //console.log(roomName);
        io.to(roomName).emit('noti_join_room', "방에 입장하였습니다.");
    });

    // 채팅방에 채팅 요청
    socket.on('req_room_message', async(msg) => {
        let userCurrentRoom = getUserCurrentRoom(socket);
        //console.log(msg);
        console.log(userCurrentRoom);
        io.to(userCurrentRoom).emit('noti_room_message', msg);
    });

    socket.on('disconnect', async () => {
        console.log('user disconnected');
    });
});


// TEST CODE GOES HERE
(async function(){
})();

function getUserCurrentRoom(socket){
    let currentRoom = '';
    //let socketRooms = Object.keys(socket.rooms);
    const rooms = socket.rooms;
    console.log(socket.rooms);

    rooms.forEach(room => {
        if(room.indexOf('Room_') == 0){
            currentRoom = room;
        }
    });
    console.log(currentRoom);
    return currentRoom;
}
};