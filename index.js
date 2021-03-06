
var io = require('socket.io')(process.env.PORT || 3000);
var shortid = require('shortid');


var players = [];
console.log('server started')

io.on('connection', function(socket){

    var thisPlayerId = shortid.generate();
    var player = {
        id: thisPlayerId,
        x: 0,
        y: 0
    };

    players[thisPlayerId] = player;
    console.log('client connected, broadcasting spawn ' + thisPlayerId);

    socket.broadcast.emit('spawn', { id: thisPlayerId });

    for(var playerId in players) {
        if( playerId == thisPlayerId )
            continue;
        socket.emit('spawn', players[playerId]); 
        console.log('sending spawn to new player');
    }

    socket.on('move', function(data){
        data.id = thisPlayerId;
        console.log('client moved', JSON.stringify(data));

        player.x = data.x;
        player.y = data.y;

        socket.broadcast.emit('move', data);
    });

    socket.on('disconnect', function(){
        console.log('client disconnected');
        delete players[thisPlayerId];

        socket.broadcast.emit('disconnected', { id : thisPlayerId });
    });
})
