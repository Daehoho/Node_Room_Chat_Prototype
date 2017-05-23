var socket_ids = [];
var count = 0;
var rooms = [];


module.exports = function (io) {
    function registerUser(socket, nickname) {
        var pre_nick = socket.nickname;
        if (pre_nick != undefined) delete socket_ids[pre_nick];
        socket_ids[nickname] = socket.id;
        socket.nickname = nickname;
        // io.sockets.emit('userlist', {users: Object.keys(socket_ids)});
    };

    io.on('connection', function (socket) {
        // registerUser(socket, 'GUEST-'+count);
        // count++;

        socket.on('changename', function(data) {
            registerUser(socket, data.nickname);
        });

        socket.on('joinroom', function (data) {
            socket.join(data.room);
            socket.room = data.room;

            var room = data.room;
            var nickname =  data.nickname;

            socket.nickname = nickname;


            socket.emit('changename', { nickname: nickname });

            // Create Room
            if (rooms[room] == undefined) {
                console.log('room create : ' + room);
                rooms[room] = new Object();
                rooms[room].socket_ids = new Object();
            }

            rooms[room].socket_ids[nickname] = socket.id;

            console.log("room state:");
            console.log(rooms);

            data = { msg: nickname + ' 님이 입장하셨습니다' };
            io.sockets.in(room).emit('broadcast_msg', data);

            io.sockets.in(room).emit('userlist', {
                users: Object.keys(rooms[room].socket_ids)
            });

            count++;
        });


        socket.on('changename', function (data) {
            var room = socket.room;
            var pre_nick = socket.nickname;
            var nickname = data.nickname;

            if (pre_nick != undefined) {
                delete rooms[room].socket_ids[pre_nick];
            }
            rooms[room].socket_ids[nickname] = socket.id;
            socket.nickname = nickname;
            data = { msg: pre_nick + ' 님이' + nickname + '으로 대화명을 변경하였습니다.' }
            io.sockets.in(room).emit('broadcast_msg', data);
            io.sockets.in(room).emit('userlist', { users: Object.keys(rooms[room].socket_ids) });
        });

        socket.on('disconnect', function (data) {
            var room = socket.room;

            if (room != undefined && rooms[room] != undefined) {
                var nickname = socket.nickname;
                console.log('nickname ' + nickname + ' has been disconnected');

                if (nickname != undefined) {
                    if (rooms[room].socket_ids != undefined
                        && rooms[room].socket_ids[nickname] != undefined)
                        delete rooms[room].socket_ids[nickname];
                }

                data = { msg: nickname + ' 님이 나가셨습니다.' };

                io.sockets.in(room).emit('broadcast_msg', data);
                io.sockets.in(room).emit('userlist', { users: Object.keys(rooms[room].socket_ids) });
            }
        });

        socket.on('send_msg', function (data) {
            var room = socket.room;
            var nickname = socket.nickname;
            console.log('in send msg room is ' + room);
            data.msg = nickname + ' : ' + data.msg;
            if (data.to == 'ALL') {
                socket.broadcast.to(room).emit('broadcast_msg', data);
            } else {
                socket_id = rooms[room].socket_ids[data.to];
                if (socket_id != undefined) {
                    data.msg = '귓속말 : ' + data.msg;
                    io.sockets.socket(socket_id).emit('broadcast_msg', data);
                }
            }
            socket.emit('broadcast_msg', data);
        });
    });

};