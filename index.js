
var io = require('socket.io')(process.env.PORT || 3000);
var shortid = require('shortid');


var playerCount = 0;
console.log('server started')

io.on('connection', function(socket){

    var thisClientid = shortid.generate();
    console.log('client connected, broadcasting spawn ' + thisClientid);

    socket.broadcast.emit('spawn');

    playerCount++;

    for(i=0; i< playerCount; i++) {
        socket.emit('spawn');
        console.log('sending spawn to new player');
    }

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
