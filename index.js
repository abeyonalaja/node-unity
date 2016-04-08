
var io = require('socket.io')(process.env.PORT || 3000);
var shortid = require('shortid');


var players = [];
console.log('server started')

io.on('connection', function(socket){

    var thisClientid = shortid.generate();
    players.push(thisClientid);
    console.log('client connected, broadcasting spawn ' + thisClientid);

    socket.broadcast.emit('spawn', { id: thisClientid });

    players.forEach(function(playerId){
        if( playerId == thisClientid )
            return;
        socket.emit('spawn', { id: playerId}); 
        console.log('sending spawn to new player');
    });

    socket.on('move', function(data){
        data.id = thisClientid;
        console.log('client moved', JSON.stringify(data));

        socket.broadcast.emit('move', data);
    });

    socket.on('disconnect', function(){
        console.log('client disconnected');
        playerCount--;
    });
})
